"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Stepper } from "@/components/ui/stepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  Globe,
  Sparkles,
  User,
  Building2,
  Loader2,
  Bot,
  Send,
  FileText,
  CheckCircle,
  ExternalLink,
  Wifi,
  Mic,
  MicOff,
} from "lucide-react";

const steps = [
  { id: 1, label: "Your Details" },
  { id: 2, label: "Website Crawl" },
  { id: 3, label: "Departments" },
  { id: 4, label: "AI Assessment" },
  { id: 5, label: "Results" },
];

interface Message {
  role: "agent" | "user" | "system";
  content: string;
  analysis?: string;
  keyFindings?: string[];
}

interface CrawledPage {
  url: string;
  title: string;
  description: string;
  markdown: string;
  links: string[];
}

interface DepartmentSuggestion {
  name: string;
  description: string;
  relevance: number;
}

interface QuestionData {
  text: string;
  options: string[];
  context: string;
  transition: string;
}
import type { ReportData } from "./types";

const STORAGE_KEY = "synked_audit_session";

interface SavedSession {
  threadId: string;
  currentStep: number;
  messages: Message[];
  name: string;
  email: string;
  company: string;
  role: string;
  industry: string;
  url: string;
  questionNumber: number;
  totalQuestions: number;
  activeQuestion: QuestionData | null;
  suggestedDepartments: DepartmentSuggestion[];
  selectedDepartments: string[];
  timestamp: number;
}

export default function BusinessAuditPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "agent",
      content:
        "Welcome to the Synked.ai Business Audit Engine. I'll assess your business's AI-readiness and identify automation opportunities.\n\nLet's start with some details about you and your company.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [freeInput, setFreeInput] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);
  const [savedSessionMeta, setSavedSessionMeta] = useState<{
    company: string;
    step: number;
    timestamp: number;
  } | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const session: SavedSession = JSON.parse(stored);
        const isRecent = Date.now() - session.timestamp < 24 * 60 * 60 * 1000;
        if (isRecent && session.currentStep < 5) {
          return {
            company: session.company,
            step: session.currentStep,
            timestamp: session.timestamp,
          };
        }
      }
    } catch {
      /* ignore */
    }
    return null;
  });

  // Thread ID for LangGraph state persistence
  const threadIdRef = useRef<string>(crypto.randomUUID());

  // Step 1: User details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [industry, setIndustry] = useState("");

  // Step 2: Crawl state
  const [url, setUrl] = useState("");
  const [crawling, setCrawling] = useState(false);
  const [crawledPages, setCrawledPages] = useState<CrawledPage[]>([]);
  const [crawlStatus, setCrawlStatus] = useState<string>("");

  // Step 3: Options state
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherText, setOtherText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Current question state (from LangGraph)
  const [activeQuestion, setActiveQuestion] = useState<QuestionData | null>(
    null,
  );
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(5);

  // Departments state
  const [suggestedDepartments, setSuggestedDepartments] = useState<
    DepartmentSuggestion[]
  >([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  // Final report state
  const [reportData, setReportData] = useState<ReportData | null>(null);

  // Progressive scores state
  interface PartialScores {
    scores: {
      toolChaos: number | null;
      leadLeakage: number | null;
      processFragmentation: number | null;
      communicationOverload: number | null;
      dataDisconnection: number | null;
    };
    confidence: number;
  }
  const [partialScores, setPartialScores] = useState<PartialScores | null>(
    null,
  );
  const [isProbe, setIsProbe] = useState(false);

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading, crawledPages]);

  // ─── Session Persistence ──────────────────────────────────────────────────

  // Save session to localStorage whenever key state changes
  useEffect(() => {
    // Don't save if we're still on step 1 with no progress or already done
    if (currentStep <= 1 && messages.length <= 1) return;
    if (currentStep === 5) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    const session: SavedSession = {
      threadId: threadIdRef.current,
      currentStep,
      messages,
      name,
      email,
      company,
      role,
      industry,
      url,
      questionNumber,
      totalQuestions,
      activeQuestion,
      suggestedDepartments,
      selectedDepartments,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [
    currentStep,
    messages,
    name,
    email,
    company,
    role,
    industry,
    url,
    questionNumber,
    totalQuestions,
    activeQuestion,
    suggestedDepartments,
    selectedDepartments,
  ]);

  function resumeSession() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      const session: SavedSession = JSON.parse(stored);

      // Restore all state
      threadIdRef.current = session.threadId;
      setCurrentStep(session.currentStep);
      setMessages(session.messages);
      setName(session.name);
      setEmail(session.email);
      setCompany(session.company);
      setRole(session.role);
      setIndustry(session.industry);
      setUrl(session.url);
      setQuestionNumber(session.questionNumber);
      setTotalQuestions(session.totalQuestions);
      setActiveQuestion(session.activeQuestion);
      setSuggestedDepartments(session.suggestedDepartments);
      setSelectedDepartments(session.selectedDepartments);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setSavedSessionMeta(null);
  }

  function discardSession() {
    localStorage.removeItem(STORAGE_KEY);
    setSavedSessionMeta(null);
  }

  // Voice recognition setup
  function startListening() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setOtherText(transcript);
      setIsListening(false);
      // Auto-submit after voice input
      sendAnswer(transcript.trim());
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setIsListening(false);
  }

  // ─── API Calls (action-based) ───────────────────────────────────────────────

  async function startAudit(userContext: {
    name: string;
    email: string;
    company: string;
    role: string;
    industry: string;
  }) {
    const res = await fetch("/api/audit/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "start",
        threadId: threadIdRef.current,
        userContext,
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to start audit");
    }
    return await res.json();
  }

  async function sendCrawlData(crawlData: string) {
    const res = await fetch("/api/audit/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "crawl_complete",
        threadId: threadIdRef.current,
        crawlData,
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to send crawl data");
    }
    return await res.json();
  }

  async function sendDepartmentsSelection(departments: string[]) {
    const res = await fetch("/api/audit/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "departments_selected",
        threadId: threadIdRef.current,
        departments,
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to send departments");
    }
    return await res.json();
  }

  async function sendAnswerToAgent(answer: string) {
    const res = await fetch("/api/audit/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "answer",
        threadId: threadIdRef.current,
        answer,
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to send answer");
    }
    return await res.json();
  }

  // ─── Handlers ───────────────────────────────────────────────────────────────

  async function handleStep1Submit(e: React.FormEvent) {
    e.preventDefault();
    const userMsg = `I'm ${name}, ${role} at ${company} in the ${industry} industry. My email is ${email}.`;

    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const response = await startAudit({
        name,
        email,
        company,
        role,
        industry,
      });
      setMessages((prev) => [
        ...prev,
        { role: "agent", content: response.greeting },
      ]);
      setCurrentStep(2);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          content:
            "I had a brief connection issue. Let's continue — please provide your website URL so I can analyze your digital presence.",
        },
      ]);
      setCurrentStep(2);
    } finally {
      setLoading(false);
    }
  }

  const handleCrawl = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const userMsg = `Here's our website: ${url}`;
      setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
      setCrawling(true);
      setCrawledPages([]);
      setCrawlStatus("Connecting to crawler...");

      setMessages((prev) => [
        ...prev,
        { role: "system", content: "CRAWL_START" },
      ]);

      try {
        const res = await fetch("/api/audit/crawl", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        if (!res.ok) {
          throw new Error("Failed to start crawl");
        }

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        const pages: CrawledPage[] = [];
        let buffer = "";

        if (!reader) throw new Error("No stream available");

        setCrawlStatus("Crawling live via WebSocket...");
        let crawlError = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split("\n\n");
          buffer = events.pop() || "";

          for (const event of events) {
            const lines = event.split("\n");
            const eventType = lines
              .find((l) => l.startsWith("event:"))
              ?.replace("event: ", "");
            const dataLine = lines
              .find((l) => l.startsWith("data:"))
              ?.replace("data: ", "");

            if (!eventType || !dataLine) continue;

            const data = JSON.parse(dataLine);

            if (eventType === "document") {
              const page: CrawledPage = data;
              pages.push(page);
              setCrawledPages([...pages]);
              setCrawlStatus(
                `Found ${pages.length} page${pages.length > 1 ? "s" : ""}...`,
              );
            } else if (eventType === "done") {
              setCrawlStatus(`Crawl complete — ${pages.length} pages analyzed`);
            } else if (eventType === "error") {
              crawlError = data.message || "Unknown crawl error";
              console.warn("Crawl stream error:", crawlError);
            }
          }
        }

        // If crawl had errors and got no pages, use fallback message
        if (pages.length === 0 && crawlError) {
          throw new Error(crawlError);
        }

        // Build crawl data string for the agent
        const crawlDataStr = pages
          .map(
            (p) =>
              `Page: ${p.title} (${p.url})\nDescription: ${p.description}\nContent preview: ${p.markdown.slice(0, 500)}`,
          )
          .join("\n\n---\n\n");

        // Send crawl data to graph — get analysis + first question
        setCrawlStatus("AI analyzing findings...");
        setLoading(true);

        const response = await sendCrawlData(crawlDataStr);

        // Remove CRAWL_START marker and add analysis message
        setMessages((prev) => [
          ...prev.filter((m) => m.content !== "CRAWL_START"),
          {
            role: "agent",
            content: response.analysis || "Website analyzed successfully.",
            analysis: response.analysis,
            keyFindings: response.keyFindings,
          },
        ]);

        // Set departments state for selection
        if (response.suggestedDepartments) {
          setSuggestedDepartments(response.suggestedDepartments);
        }
        setCurrentStep(3);
      } catch {
        setMessages((prev) => [
          ...prev.filter((m) => m.content !== "CRAWL_START"),
          {
            role: "agent",
            content:
              "I had trouble crawling the website, but let's continue with the assessment based on what I know.",
          },
        ]);

        // Still send crawl data to advance the graph past the wait_for_crawl interrupt
        try {
          const fallbackCrawl = `Crawl failed for ${url}. No pages were retrieved. Proceed with assessment based on company info: ${company} in ${industry} industry.`;
          const response = await sendCrawlData(fallbackCrawl);

          if (response.suggestedDepartments) {
            setSuggestedDepartments(response.suggestedDepartments);
          } else {
            // Fallback departments if backend also fails
            setSuggestedDepartments([
              {
                name: "Customer Support",
                description: "Automate responses and ticket routing",
                relevance: 8,
              },
              {
                name: "Sales & Marketing",
                description: "Lead generation and content automation",
                relevance: 7,
              },
              {
                name: "Operations",
                description: "Workflow optimization and process automation",
                relevance: 7,
              },
              {
                name: "Finance & Admin",
                description: "Invoice processing and reporting",
                relevance: 5,
              },
            ]);
          }
        } catch {
          // If even fallback crawl fails, use hardcoded departments
          setSuggestedDepartments([
            {
              name: "Customer Support",
              description: "Automate responses and ticket routing",
              relevance: 8,
            },
            {
              name: "Sales & Marketing",
              description: "Lead generation and content automation",
              relevance: 7,
            },
            {
              name: "Operations",
              description: "Workflow optimization and process automation",
              relevance: 7,
            },
            {
              name: "Finance & Admin",
              description: "Invoice processing and reporting",
              relevance: 5,
            },
          ]);
        }
        setCurrentStep(3);
      } finally {
        setCrawling(false);
        setLoading(false);
        setCrawlStatus("");
      }
    },
    [url, company, industry],
  );

  async function sendAnswer(answer: string) {
    if (!answer.trim() || loading) return;

    setShowOtherInput(false);
    setOtherText("");
    setFreeInput("");
    setActiveQuestion(null);
    setIsProbe(false);
    setMessages((prev) => [...prev, { role: "user", content: answer }]);
    setLoading(true);

    try {
      const response = await sendAnswerToAgent(answer);

      if (response.phase === "report" && response.report) {
        // Store report and navigate to report page
        localStorage.setItem(
          "synked_audit_report",
          JSON.stringify({
            report: response.report,
            companyName: company || "Your Business",
          }),
        );
        setReportData(response.report);
        setActiveQuestion(null);
        setCurrentStep(5);
        router.push("/business-audit/report");
      } else if (response.phase === "probe" && response.question) {
        // Follow-up probe for vague answer
        const transition =
          response.question.transition || "Could you tell me a bit more?";
        setMessages((prev) => [
          ...prev,
          { role: "agent", content: transition },
        ]);
        setActiveQuestion(response.question);
        setIsProbe(true);
        // Update partial scores if available
        if (response.partialScores) {
          setPartialScores(response.partialScores);
        }
      } else if (response.phase === "question" && response.question) {
        // Add transition message + set new question
        const transition =
          response.question.transition || "Thanks for that insight.";
        setMessages((prev) => [
          ...prev,
          { role: "agent", content: transition },
        ]);
        setActiveQuestion(response.question);
        setQuestionNumber(response.questionNumber);
        // Update partial scores if available
        if (response.partialScores) {
          setPartialScores(response.partialScores);
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          content: "Sorry, I had a brief issue. Could you repeat that?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleOptionClick(option: string, isOther: boolean) {
    if (isOther) {
      setShowOtherInput(true);
      return;
    }
    await sendAnswer(option);
  }

  function toggleDepartment(name: string) {
    setSelectedDepartments((prev) => {
      if (prev.includes(name)) {
        return prev.filter((d) => d !== name);
      }
      if (prev.length >= 4) return prev; // max 4
      return [...prev, name];
    });
  }

  async function handleDepartmentsSubmit() {
    if (selectedDepartments.length < 2) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: `I'd like to focus on: ${selectedDepartments.join(", ")}`,
      },
    ]);
    setLoading(true);
    setSuggestedDepartments([]); // hide the selection UI

    try {
      const response = await sendDepartmentsSelection(selectedDepartments);

      if (response.question) {
        const transition =
          response.question.transition || "Let's begin the assessment.";
        setMessages((prev) => [
          ...prev,
          { role: "agent", content: transition },
        ]);
        setActiveQuestion(response.question);
        setQuestionNumber(response.questionNumber);
        setTotalQuestions(response.totalQuestions);
      }
      setCurrentStep(4);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          content: "Something went wrong. Let me try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleOtherSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!otherText.trim()) return;
    await sendAnswer(otherText.trim());
  }

  async function handleFreeInput(e: React.FormEvent) {
    e.preventDefault();
    if (!freeInput.trim() || loading) return;
    await sendAnswer(freeInput.trim());
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-off-white">
      {/* Header */}
      <div className="border-b border-bone bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between px-4 py-3 md:py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-espresso">
                Business Audit Engine
              </h1>
              <p className="text-xs text-espresso/50 font-mono">SYNKED.AI</p>
            </div>
          </div>
          <Stepper steps={steps} currentStep={currentStep} />
        </div>
      </div>

      {/* Resume Banner */}
      {savedSessionMeta && (
        <div className="border-b border-emerald/20 bg-emerald/5 px-4 py-3 animate-in slide-in-from-top-2 duration-300">
          <div className="container mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald/10">
                <FileText className="h-4 w-4 text-emerald" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-espresso truncate">
                  You have an unfinished audit
                  {savedSessionMeta.company
                    ? ` for ${savedSessionMeta.company}`
                    : ""}
                </p>
                <p className="text-xs text-espresso/50">
                  Step {savedSessionMeta.step} of 5 •{" "}
                  {new Date(savedSessionMeta.timestamp).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    },
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={discardSession}
                className="border-bone text-espresso/60 hover:bg-bone/50 text-xs"
              >
                Start Fresh
              </Button>
              <Button
                size="sm"
                onClick={resumeSession}
                className="bg-emerald text-white hover:bg-emerald-lt text-xs"
              >
                Resume
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat area */}
        <div
          className={`flex-1 overflow-y-auto transition-all duration-500 ${crawling ? "w-1/2" : "w-full"}`}
          ref={chatRef}
        >
          <div className="mx-auto max-w-3xl px-4 py-6">
            <div className="space-y-0 divide-y divide-bone/50">
              {messages
                .filter((m) => m.role !== "system")
                .map((msg, i) => (
                  <div key={i} className="py-6">
                    <div className="flex gap-4">
                      {/* Avatar */}
                      <div className="shrink-0 pt-0.5">
                        {msg.role === "agent" ? (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald">
                            <Sparkles className="h-4 w-4 text-white" />
                          </div>
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-espresso/10">
                            <User className="h-4 w-4 text-espresso" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-espresso/50 mb-1.5">
                          {msg.role === "agent" ? "Synked AI" : "You"}
                        </p>
                        {msg.role === "agent" ? (
                          <div className="prose prose-sm prose-espresso max-w-none text-espresso leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_p]:mb-3 [&_ul]:mb-3 [&_ol]:mb-3 [&_li]:mb-1 [&_h1]:text-lg [&_h1]:font-semibold [&_h1]:text-espresso [&_h1]:mt-4 [&_h1]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-espresso [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-espresso [&_h3]:mt-3 [&_h3]:mb-1 [&_strong]:text-espresso [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_code]:bg-bone/50 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono [&_blockquote]:border-l-2 [&_blockquote]:border-emerald/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-espresso/70 [&_hr]:my-4 [&_hr]:border-bone">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-sm text-espresso leading-relaxed">
                            {msg.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

              {loading && !crawling && (
                <div className="py-6">
                  <div className="flex gap-4">
                    <div className="shrink-0 pt-0.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-espresso/50 mb-1.5">
                        Synked AI
                      </p>
                      <div className="flex items-center gap-2 text-sm text-espresso/60">
                        <span className="inline-flex gap-1">
                          <span className="h-2 w-2 rounded-full bg-emerald animate-bounce [animation-delay:0ms]" />
                          <span className="h-2 w-2 rounded-full bg-emerald animate-bounce [animation-delay:150ms]" />
                          <span className="h-2 w-2 rounded-full bg-emerald animate-bounce [animation-delay:300ms]" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Crawl Panel — slides in from right */}
        {crawling && (
          <div className="w-1/2 border-l border-bone bg-white/60 backdrop-blur-sm overflow-y-auto animate-in slide-in-from-right duration-500">
            <div className="p-6">
              {/* Crawl Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald" />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald font-medium">
                    Live Crawl
                  </span>
                  <Wifi className="h-3 w-3 text-emerald ml-auto" />
                </div>
                <p className="text-sm text-espresso/70">{crawlStatus}</p>
                <div className="mt-3 h-1.5 w-full rounded-full bg-bone overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-emerald to-pistachio rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${Math.min((crawledPages.length / 8) * 100, 100)}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-espresso/40 mt-1 font-mono">
                  {crawledPages.length} / ~8 pages
                </p>
              </div>

              {/* Crawled Pages List */}
              <div className="space-y-3">
                {crawledPages.map((page, i) => (
                  <div
                    key={i}
                    className="group rounded-xl border border-bone bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-emerald/30 animate-in fade-in slide-in-from-bottom-2 duration-400"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald/10 text-emerald">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-espresso truncate">
                            {page.title}
                          </p>
                          <CheckCircle className="h-3.5 w-3.5 text-emerald shrink-0" />
                        </div>
                        <a
                          href={page.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-espresso/40 hover:text-emerald truncate flex items-center gap-1 mt-0.5"
                        >
                          {page.url}
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                        {page.description && (
                          <p className="text-xs text-espresso/60 mt-1.5 line-clamp-2">
                            {page.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Skeleton placeholders for upcoming pages */}
                {crawledPages.length < 8 &&
                  Array.from({
                    length: Math.min(2, 8 - crawledPages.length),
                  }).map((_, i) => (
                    <div
                      key={`skeleton-${i}`}
                      className="rounded-xl border border-bone/50 bg-white/50 p-4 animate-pulse"
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-bone/50" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-3/4 rounded bg-bone/50" />
                          <div className="h-3 w-1/2 rounded bg-bone/30" />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-bone bg-white/80 backdrop-blur-sm max-h-[55vh] md:max-h-none overflow-y-auto">
        <div className="container mx-auto max-w-3xl px-4 py-3 md:py-6">
          {/* Step 1: User details form */}
          {currentStep === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-espresso/60">
                    <User className="mr-1 inline h-3 w-3" />
                    Full Name
                  </Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Smith"
                    required
                    className="bg-white border-bone"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-espresso/60">
                    Email
                  </Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@company.com"
                    required
                    className="bg-white border-bone"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-espresso/60">
                    <Building2 className="mr-1 inline h-3 w-3" />
                    Company
                  </Label>
                  <Input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Acme Inc"
                    required
                    className="bg-white border-bone"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-espresso/60">
                    Your Role
                  </Label>
                  <Input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="CEO / CTO / Operations"
                    required
                    className="bg-white border-bone"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-espresso/60">
                  Industry
                </Label>
                <Input
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="E-commerce, Healthcare, Finance, etc."
                  required
                  className="bg-white border-bone"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald text-white hover:bg-emerald-lt h-11 text-sm uppercase tracking-wider font-medium"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Step 2: URL input */}
          {currentStep === 2 && (
            <form onSubmit={handleCrawl} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-espresso/60">
                  <Globe className="mr-1 inline h-3 w-3" />
                  Website URL
                </Label>
                <Input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://yourcompany.com"
                  required
                  disabled={crawling}
                  className="bg-white border-bone h-11"
                />
              </div>
              <Button
                type="submit"
                disabled={crawling}
                className="w-full bg-emerald text-white hover:bg-emerald-lt h-11 text-sm uppercase tracking-wider font-medium"
              >
                {crawling ? (
                  <div className="flex items-center gap-2">
                    <div className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                    </div>
                    Crawling Live...
                  </div>
                ) : (
                  <>
                    Crawl & Analyze <Sparkles className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Step 3: Department Selection UI */}
          {currentStep === 3 && !loading && suggestedDepartments.length > 0 && (
            <div className="space-y-3 md:space-y-4">
              <div className="rounded-lg bg-emerald/5 border border-emerald/10 px-3 py-2 md:px-4 md:py-2.5">
                <p className="text-xs text-emerald/80 leading-relaxed">
                  Based on my analysis, I&apos;ve identified departments that
                  could benefit from AI automation. Select 2-4 areas you&apos;d
                  like me to focus the assessment on.
                </p>
              </div>

              <div className="max-h-[35vh] md:max-h-none overflow-y-auto -mx-1 px-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                  {suggestedDepartments.map((dept) => {
                    const isSelected = selectedDepartments.includes(dept.name);
                    const isDisabled =
                      !isSelected && selectedDepartments.length >= 4;
                    return (
                      <button
                        key={dept.name}
                        type="button"
                        onClick={() => toggleDepartment(dept.name)}
                        disabled={isDisabled}
                        className={`group relative rounded-xl border p-3 md:p-4 text-left transition-all ${
                          isSelected
                            ? "border-emerald bg-emerald/5 shadow-sm"
                            : isDisabled
                              ? "border-bone/50 bg-bone/20 opacity-50 cursor-not-allowed"
                              : "border-bone bg-white hover:border-emerald/40 hover:shadow-sm"
                        }`}
                      >
                        {/* Selection indicator */}
                        <div
                          className={`absolute top-3 right-3 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? "border-emerald bg-emerald"
                              : "border-bone group-hover:border-emerald/40"
                          }`}
                        >
                          {isSelected && (
                            <CheckCircle className="h-3 w-3 text-white" />
                          )}
                        </div>

                        {/* Relevance badge */}
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                              dept.relevance >= 8
                                ? "bg-emerald/10 text-emerald"
                                : dept.relevance >= 6
                                  ? "bg-pistachio/10 text-pistachio"
                                  : "bg-bone text-espresso/60"
                            }`}
                          >
                            {dept.relevance >= 8
                              ? "High Opportunity"
                              : dept.relevance >= 6
                                ? "Medium Opportunity"
                                : "Some Opportunity"}
                          </span>
                        </div>

                        <h4 className="text-sm font-semibold text-espresso mb-1 pr-6">
                          {dept.name}
                        </h4>
                        <p className="text-xs text-espresso/60 leading-relaxed">
                          {dept.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit button */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-espresso/40 font-mono">
                  {selectedDepartments.length}/4 selected (min 2)
                </span>
                <Button
                  onClick={handleDepartmentsSubmit}
                  disabled={selectedDepartments.length < 2}
                  className="bg-emerald text-white hover:bg-emerald-lt disabled:opacity-40"
                >
                  Continue Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Structured question UI */}
          {currentStep >= 4 && !loading && activeQuestion && (
            <div className="space-y-4">
              {/* Question progress */}
              <div className="flex items-center gap-3 mb-1">
                <div className="flex gap-1">
                  {Array.from({ length: totalQuestions }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 w-6 rounded-full transition-colors ${
                        i < questionNumber ? "bg-emerald" : "bg-bone"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-mono text-espresso/40">
                  {questionNumber}/{totalQuestions}
                </span>
                {isProbe && (
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    Follow-up
                  </span>
                )}
              </div>

              {/* Progressive Score Panel */}
              {partialScores && (
                <div className="rounded-xl border border-bone bg-gradient-to-r from-emerald/5 to-transparent p-3 mb-2 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-espresso/40">
                      Live Assessment
                    </span>
                    <span className="text-[10px] font-mono text-emerald/70">
                      {partialScores.confidence}% confidence
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {(
                      [
                        ["toolChaos", "Tools"],
                        ["leadLeakage", "Leads"],
                        ["processFragmentation", "Process"],
                        ["communicationOverload", "Comms"],
                        ["dataDisconnection", "Data"],
                      ] as const
                    ).map(([key, label]) => {
                      const val =
                        partialScores.scores[
                          key as keyof typeof partialScores.scores
                        ];
                      return (
                        <div
                          key={key}
                          className="flex flex-col items-center gap-1"
                        >
                          <div className="relative h-8 w-8 flex items-center justify-center">
                            <svg
                              className="h-8 w-8 -rotate-90"
                              viewBox="0 0 32 32"
                            >
                              <circle
                                cx="16"
                                cy="16"
                                r="12"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                className="text-bone"
                              />
                              {val !== null && (
                                <circle
                                  cx="16"
                                  cy="16"
                                  r="12"
                                  fill="none"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeDasharray={2 * Math.PI * 12}
                                  strokeDashoffset={
                                    2 * Math.PI * 12 -
                                    (val / 100) * 2 * Math.PI * 12
                                  }
                                  className={`transition-all duration-1000 ease-out ${
                                    val >= 70
                                      ? "stroke-red-400"
                                      : val >= 40
                                        ? "stroke-amber-400"
                                        : "stroke-emerald"
                                  }`}
                                />
                              )}
                            </svg>
                            <span className="absolute text-[9px] font-mono font-bold text-espresso/70">
                              {val !== null ? val : "–"}
                            </span>
                          </div>
                          <span className="text-[9px] text-espresso/40 font-mono">
                            {label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Question context */}
              <div className="rounded-lg bg-emerald/5 border border-emerald/10 px-4 py-2.5">
                <p className="text-xs text-emerald/80 leading-relaxed">
                  {activeQuestion.context}
                </p>
              </div>

              {/* Question text */}
              <p className="text-sm font-medium text-espresso">
                {activeQuestion.text}
              </p>

              {/* Option buttons */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {activeQuestion.options.map((option, idx) => {
                  const isOther =
                    option.toLowerCase().includes("other") &&
                    idx === activeQuestion.options.length - 1;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(option, isOther)}
                      disabled={loading}
                      className="group relative rounded-xl border border-bone bg-white px-4 py-3.5 text-left text-sm text-espresso transition-all hover:border-emerald hover:bg-emerald/5 hover:shadow-sm active:scale-[0.98] disabled:opacity-50"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-bone/60 text-xs font-mono font-medium text-espresso/70 group-hover:bg-emerald/10 group-hover:text-emerald transition-colors">
                          {idx + 1}
                        </span>
                        <span className="leading-snug">{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* "Other" expanded input with voice */}
              {showOtherInput && (
                <form
                  onSubmit={handleOtherSubmit}
                  className="flex gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200"
                >
                  <div className="relative flex-1">
                    <Input
                      value={otherText}
                      onChange={(e) => setOtherText(e.target.value)}
                      placeholder="Type your answer or use voice..."
                      autoFocus
                      className="bg-white border-bone h-11 pr-12"
                    />
                    <button
                      type="button"
                      onClick={isListening ? stopListening : startListening}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 transition-colors ${
                        isListening
                          ? "bg-red-100 text-red-600 animate-pulse"
                          : "bg-bone/50 text-espresso/50 hover:bg-emerald/10 hover:text-emerald"
                      }`}
                    >
                      {isListening ? (
                        <MicOff className="h-4 w-4" />
                      ) : (
                        <Mic className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <Button
                    type="submit"
                    disabled={!otherText.trim()}
                    className="bg-emerald text-white hover:bg-emerald-lt h-11 px-4"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </div>
          )}

          {/* Step 4: Free input fallback (no structured question) */}
          {currentStep >= 4 &&
            !loading &&
            !activeQuestion &&
            !reportData &&
            !suggestedDepartments.length && (
              <form onSubmit={handleFreeInput} className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    value={freeInput}
                    onChange={(e) => setFreeInput(e.target.value)}
                    placeholder="Type your answer or use voice..."
                    disabled={loading}
                    className="bg-white border-bone h-11 pr-12"
                  />
                  <button
                    type="button"
                    onClick={isListening ? stopListening : startListening}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 transition-colors ${
                      isListening
                        ? "bg-red-100 text-red-600 animate-pulse"
                        : "bg-bone/50 text-espresso/50 hover:bg-emerald/10 hover:text-emerald"
                    }`}
                  >
                    {isListening ? (
                      <MicOff className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <Button
                  type="submit"
                  disabled={loading || !freeInput.trim()}
                  className="bg-emerald text-white hover:bg-emerald-lt h-11 px-4"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            )}

          {/* Loading state for step 3 */}
          {currentStep >= 3 && loading && (
            <div className="flex items-center gap-3 py-2">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald animate-bounce [animation-delay:0ms]" />
                <span className="h-2 w-2 rounded-full bg-emerald animate-bounce [animation-delay:150ms]" />
                <span className="h-2 w-2 rounded-full bg-emerald animate-bounce [animation-delay:300ms]" />
              </div>
              <span className="text-xs text-espresso/50">
                Analyzing your response...
              </span>
            </div>
          )}

          {/* Step 5: Report redirect */}
          {currentStep === 5 && reportData && !loading && (
            <div className="flex items-center justify-center gap-3 py-2">
              <CheckCircle className="h-4 w-4 text-emerald" />
              <span className="text-sm text-espresso/70">
                Your report is ready. Redirecting...
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
