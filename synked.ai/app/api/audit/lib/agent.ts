import {
  Annotation,
  StateGraph,
  interrupt,
  START,
  END,
} from "@langchain/langgraph";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import {
  GreetingSchema,
  AnalysisSchema,
  DepartmentsSchema,
  QuestionSchema,
  ReportSchema,
  AnswerQualitySchema,
  PartialScoreSchema,
  QuestionRoutingSchema,
  type DepartmentSuggestion,
  type QuestionOutput,
  type ReportOutput,
  type PartialScoreOutput,
  type AnswerQualityOutput,
} from "./schemas";

// ─── State Definition ─────────────────────────────────────────────────────────

const AuditState = Annotation.Root({
  // User context
  name: Annotation<string>({ reducer: (_, b) => b, default: () => "" }),
  email: Annotation<string>({ reducer: (_, b) => b, default: () => "" }),
  company: Annotation<string>({ reducer: (_, b) => b, default: () => "" }),
  role: Annotation<string>({ reducer: (_, b) => b, default: () => "" }),
  industry: Annotation<string>({ reducer: (_, b) => b, default: () => "" }),
  url: Annotation<string>({ reducer: (_, b) => b, default: () => "" }),

  // Crawl data
  crawlData: Annotation<string>({ reducer: (_, b) => b, default: () => "" }),

  // Agent outputs
  greeting: Annotation<string>({ reducer: (_, b) => b, default: () => "" }),
  analysis: Annotation<string>({ reducer: (_, b) => b, default: () => "" }),
  keyFindings: Annotation<string[]>({
    reducer: (_, b) => b,
    default: () => [],
  }),

  // Departments
  suggestedDepartments: Annotation<DepartmentSuggestion[]>({
    reducer: (_, b) => b,
    default: () => [],
  }),
  selectedDepartments: Annotation<string[]>({
    reducer: (_, b) => b,
    default: () => [],
  }),

  // Question tracking (dynamic based on departments)
  questionTopics: Annotation<{ topic: string; prompt: string }[]>({
    reducer: (_, b) => b,
    default: () => [],
  }),
  questionNumber: Annotation<number>({
    reducer: (_, b) => b,
    default: () => 0,
  }),
  totalQuestions: Annotation<number>({
    reducer: (_, b) => b,
    default: () => 5,
  }),
  currentQuestion: Annotation<QuestionOutput | null>({
    reducer: (_, b) => b,
    default: () => null,
  }),
  answers: Annotation<string[]>({
    reducer: (a, b) => [...a, ...b],
    default: () => [],
  }),

  // Report
  reportData: Annotation<ReportOutput | null>({
    reducer: (_, b) => b,
    default: () => null,
  }),

  // Adaptive flow
  signals: Annotation<string[]>({
    reducer: (a, b) => [...a, ...b],
    default: () => [],
  }),
  partialScores: Annotation<PartialScoreOutput | null>({
    reducer: (_, b) => b,
    default: () => null,
  }),
  lastAnswerQuality: Annotation<AnswerQualityOutput | null>({
    reducer: (_, b) => b,
    default: () => null,
  }),
  probeCount: Annotation<number>({
    reducer: (_, b) => b,
    default: () => 0,
  }),
  skippedTopics: Annotation<string[]>({
    reducer: (_, b) => b,
    default: () => [],
  }),

  // Flow control
  phase: Annotation<string>({ reducer: (_, b) => b, default: () => "init" }),
});

export type AuditStateType = typeof AuditState.State;

// ─── Model Factory (with retry + fallback) ────────────────────────────────────

function getModel() {
  return new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0.7,
    maxOutputTokens: 4096,
  });
}

function getReportModel() {
  return new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0.6,
    maxOutputTokens: 8192,
  });
}

/**
 * Helper: get a structured output runnable with retry.
 * Apply withStructuredOutput first, then wrap with retry.
 */
function getStructured<T extends Record<string, unknown>>(
  schema: import("zod").ZodType<T>,
  useReportModel = false,
) {
  const model = useReportModel ? getReportModel() : getModel();
  return model.withStructuredOutput(schema).withRetry({ stopAfterAttempt: 3 });
}

// ─── Nodes ────────────────────────────────────────────────────────────────────

async function greetNode(state: typeof AuditState.State) {
  const structured = getStructured(GreetingSchema);

  const result = await structured.invoke([
    new SystemMessage(
      `You are the Synked.ai Business Audit Agent — a sharp, professional AI strategy consultant.
Generate a warm but concise greeting for the user. Acknowledge their name, role, and company.
Tell them you're ready to analyze their website to identify AI automation opportunities.
Keep it to 2-3 sentences. Be professional, not overly enthusiastic.`,
    ),
    new HumanMessage(
      `User details: ${state.name}, ${state.role} at ${state.company} in the ${state.industry} industry.`,
    ),
  ]);

  return {
    greeting: result.message,
    phase: "greeting_done",
  };
}

async function analyzeNode(state: typeof AuditState.State) {
  const structured = getStructured(AnalysisSchema);

  const result = await structured.invoke([
    new SystemMessage(
      `You are the Synked.ai Business Audit Agent. Analyze the following website crawl data.

Your analysis MUST:
- Reference specific pages by title/URL that were crawled
- Identify their tech stack, services, and business model
- Spot automation opportunities based on their actual content
- Evaluate digital maturity level
- Be specific and cite real content — NEVER use placeholder brackets like "[mention services]"

Company: ${state.company} (${state.industry})
Website: ${state.url}

Keep the summary to 150-250 words. Be incisive and specific.`,
    ),
    new HumanMessage(`Website crawl data:\n\n${state.crawlData}`),
  ]);

  return {
    analysis: result.summary,
    keyFindings: result.keyFindings,
    phase: "analysis_done",
  };
}

async function suggestDepartmentsNode(state: typeof AuditState.State) {
  const structured = getStructured(DepartmentsSchema);

  const result = await structured.invoke([
    new SystemMessage(
      `You are the Synked.ai Business Audit Agent. Based on the website analysis, suggest departments/business areas that could benefit from AI automation.

Company: ${state.company} (${state.industry})
Website Analysis: ${state.analysis}
Key Findings: ${state.keyFindings.join("; ")}

Rules:
- Suggest 4-8 departments that are RELEVANT to this specific business
- Each department must be tied to something you found on their website
- Include a brief description of what AI could do for that department
- Assign a relevance score (1-10) based on how much opportunity you spotted
- Be specific — "Customer Support" is better than "Operations"
- Tailor to their industry — a SaaS company has different departments than a restaurant chain
- Order by relevance (highest first)`,
    ),
    new HumanMessage(
      `Suggest departments for ${state.company} that could benefit from AI automation.`,
    ),
  ]);

  return {
    suggestedDepartments: result.departments,
    phase: "departments_suggested",
  };
}

function buildQuestionTopics(
  selectedDepartments: string[],
  industry: string,
): { topic: string; prompt: string }[] {
  // Always include these two foundational questions
  const topics: { topic: string; prompt: string }[] = [
    {
      topic: "operational pain points",
      prompt: `Ask about their biggest operational pain points across their selected departments (${selectedDepartments.join(", ")}). What manual/repetitive tasks consume the most time?`,
    },
    {
      topic: "current AI/automation usage",
      prompt: `Ask about their current use of AI or automation tools in ${selectedDepartments.join(", ")}. What have they tried? What's working or not?`,
    },
  ];

  // Add 1-2 department-specific questions
  for (const dept of selectedDepartments.slice(0, 2)) {
    topics.push({
      topic: `${dept} workflows`,
      prompt: `Ask a specific question about their ${dept} department's current workflows, team size, and key bottlenecks. What processes take the most time? How many people are involved?`,
    });
  }

  // Always end with budget/timeline
  topics.push({
    topic: "budget and timeline expectations",
    prompt: `Ask about their budget range and timeline expectations for implementing AI solutions across ${selectedDepartments.join(", ")}. What's their appetite for investment? Are they looking for quick wins or long-term transformation?`,
  });

  return topics;
}

async function questionNode(state: typeof AuditState.State) {
  const structured = getStructured(QuestionSchema);

  const qIndex = state.questionNumber;
  const topics = state.questionTopics;
  const topic = topics[qIndex];
  const totalQ = topics.length;

  // Build context about previous answers
  let previousContext = "";
  if (state.answers.length > 0) {
    const prevPairs = state.answers.map(
      (a, i) => `Q${i + 1} (${topics[i].topic}): "${a}"`,
    );
    previousContext = `\n\nPrevious answers:\n${prevPairs.join("\n")}`;
  }

  const result = await structured.invoke([
    new SystemMessage(
      `You are the Synked.ai Business Audit Agent asking assessment question ${qIndex + 1} of ${totalQ}.

Topic for this question: ${topic.prompt}

Context about the business:
- Company: ${state.company} (${state.industry})
- Website analysis: ${state.analysis}
- Key findings: ${state.keyFindings.join("; ")}
- Departments being assessed: ${state.selectedDepartments.join(", ")}${previousContext}

Rules:
- Generate 3-5 options tailored to THIS specific business (not generic)
- Reference their website/industry/departments in the options when relevant
- Include "Other (please specify)" as the last option
- The "transition" field should acknowledge their previous answer (if any) or reference the analysis
- The "context" field explains why this question matters for their AI readiness assessment`,
    ),
    new HumanMessage(
      `Generate assessment question ${qIndex + 1} about: ${topic.topic}`,
    ),
  ]);

  return {
    currentQuestion: result,
    questionNumber: qIndex + 1,
    phase: "question_asked",
  };
}

async function reportNode(state: typeof AuditState.State) {
  const structured = getStructured(ReportSchema, true);

  const topics = state.questionTopics;
  const answersContext = state.answers
    .map((a, i) => `${topics[i]?.topic || `Question ${i + 1}`}: "${a}"`)
    .join("\n");

  const signalsContext =
    state.signals.length > 0
      ? `\n\nExtracted Signals:\n${state.signals.map((s) => `- ${s}`).join("\n")}`
      : "";

  const result = await structured.invoke([
    new SystemMessage(
      `You are the Synked.ai Business Audit Agent generating a final Operational Health Report.

Company: ${state.company}
Industry: ${state.industry}
Role: ${state.role} (${state.name})
Website: ${state.url}
Departments Assessed: ${state.selectedDepartments.join(", ")}

Website Analysis:
${state.analysis}

Key Findings:
${state.keyFindings.map((f) => `- ${f}`).join("\n")}

Assessment Answers:
${answersContext}${signalsContext}

Generate a comprehensive, actionable report. Rules:

SCORING (5 named scores, each 0-100 — higher = MORE problematic = MORE opportunity):
- toolChaos: How fragmented/disconnected are their tools? Look for: multiple platforms with no integration, manual data transfer between systems, no single source of truth.
- leadLeakage: How many leads/customers are being lost? Look for: no follow-up automation, slow response times, manual lead handling, no nurture sequences.
- processFragmentation: How broken/manual are internal processes? Look for: manual repetitive tasks, no SOPs, work duplication, bottlenecks.
- communicationOverload: How overwhelmed by communication? Look for: too many channels, no routing/triage, manual responses to repetitive queries.
- dataDisconnection: How siloed is their data? Look for: data in separate systems, manual reporting, no unified analytics, blind spots.

Each score MUST have a specific rationale citing evidence from their website analysis, assessment answers, or extracted signals.
The overallScore is the average of all 5 scores (rounded to nearest integer).

OTHER SECTIONS:
- Opportunities must be specific to THIS business and their selected departments
- Reference their actual services/workflows from the website analysis
- Recommended stack should include specific tool names relevant to their industry
- Roadmap phases should have concrete, achievable milestones
- ROI projections should include realistic numbers based on their business scale
- Focus recommendations on the departments they selected: ${state.selectedDepartments.join(", ")}
- NEVER use placeholder text — everything must be specific and actionable`,
    ),
    new HumanMessage("Generate the final operational health report."),
  ]);

  return {
    reportData: result,
    phase: "report_done",
  };
}

// ─── Adaptive Nodes ───────────────────────────────────────────────────────────

async function assessAnswerQuality(state: typeof AuditState.State) {
  const structured = getStructured(AnswerQualitySchema);
  const lastAnswer = state.answers[state.answers.length - 1];
  const qIndex = state.questionNumber - 1;
  const topic = state.questionTopics[qIndex];

  const result = await structured.invoke([
    new SystemMessage(
      `You are evaluating the quality of a user's answer to an AI readiness assessment question.

Question topic: ${topic?.topic || "general assessment"}
Question asked: ${state.currentQuestion?.text || "assessment question"}

Scoring criteria:
- "rich": Contains specific details like tool names, team sizes, process descriptions, pain points with examples, or numbers. 3+ sentences or very specific short answers.
- "adequate": Provides useful information but lacks specifics. A reasonable answer that gives us something to work with.
- "vague": Too short (under 10 words for free-text), just clicked a generic option, or doesn't actually answer the question.

IMPORTANT: If the answer is one of the pre-defined options (not "Other"), it's at MINIMUM "adequate" — the options themselves contain business context. Only mark as "vague" if it's a truly uninformative free-text response.

If quality is "vague", generate a follow-up probe that:
- Acknowledges what they said
- Asks for ONE specific detail (a number, a tool name, a process example)
- Is short (1-2 sentences max)

Extract any concrete signals from their answer regardless of quality.`,
    ),
    new HumanMessage(
      `User answered: "${lastAnswer}"\n\nAssess quality and extract signals.`,
    ),
  ]);

  return {
    lastAnswerQuality: result,
    signals: result.extractedSignals,
    phase: "answer_assessed",
  };
}

async function computePartialScores(state: typeof AuditState.State) {
  const structured = getStructured(PartialScoreSchema);

  const allSignals = state.signals;
  const answersContext = state.answers
    .map((a, i) => `${state.questionTopics[i]?.topic || `Q${i + 1}`}: "${a}"`)
    .join("\n");

  const result = await structured.invoke([
    new SystemMessage(
      `You are computing progressive partial scores for an ongoing business audit.

Company: ${state.company} (${state.industry})
Website Analysis: ${state.analysis}
Key Findings: ${state.keyFindings.join("; ")}

Answers so far:
${answersContext}

Extracted signals:
${allSignals.map((s) => `- ${s}`).join("\n")}

Score each dimension 0-100 (higher = more problematic = more opportunity).
Set a score to null ONLY if you have absolutely no evidence for that dimension yet.
Once you have even a single signal about a dimension, give it a preliminary score.

Confidence: Estimate how reliable your scores are (0-100). Consider:
- How many questions have been answered
- How specific the signals are
- Whether you're extrapolating vs observing

After the first 1-2 questions, you should have at least partial scores for most dimensions from the website analysis alone.`,
    ),
    new HumanMessage("Compute current partial scores."),
  ]);

  return {
    partialScores: result,
    phase: "scores_updated",
  };
}

async function routeQuestions(state: typeof AuditState.State) {
  const structured = getStructured(QuestionRoutingSchema);

  const baseTopics = buildQuestionTopics(
    state.selectedDepartments,
    state.industry,
  );

  const result = await structured.invoke([
    new SystemMessage(
      `You are optimizing the question flow for a business audit.

Company: ${state.company} (${state.industry})
Website Analysis: ${state.analysis}
Key Findings: ${state.keyFindings.join("; ")}
Selected Departments: ${state.selectedDepartments.join(", ")}

Available question topics:
${baseTopics.map((t) => `- ${t.topic}`).join("\n")}

Decide which topics to SKIP (because the crawl data already clearly answers them) and which to PRIORITIZE (because they're the biggest unknowns).

Rules:
- Skip at most 1-2 topics. We still want human confirmation even if we have crawl evidence.
- Only skip if the crawl data provides VERY clear, specific evidence (e.g., we can see their exact tool stack from the website).
- Always keep "operational pain points" — it's the most valuable question.
- Always keep "budget and timeline expectations" — we can never infer this from a website.
- Prioritize topics where the crawl data hints at issues but we need confirmation.`,
    ),
    new HumanMessage("Route the questions for this audit."),
  ]);

  // Apply routing: remove skipped topics, reorder by priority
  let filteredTopics = baseTopics.filter(
    (t) =>
      !result.skipTopics.some((s: string) =>
        t.topic.toLowerCase().includes(s.toLowerCase()),
      ),
  );

  // Move priority topics to the front
  const prioritized: typeof baseTopics = [];
  const rest: typeof baseTopics = [];
  for (const t of filteredTopics) {
    if (
      result.priorityTopics.some((p: string) =>
        t.topic.toLowerCase().includes(p.toLowerCase()),
      )
    ) {
      prioritized.push(t);
    } else {
      rest.push(t);
    }
  }
  filteredTopics = [...prioritized, ...rest];

  return {
    questionTopics: filteredTopics,
    totalQuestions: filteredTopics.length,
    skippedTopics: result.skipTopics,
    phase: "questions_routed",
  };
}

function generateProbe(state: typeof AuditState.State) {
  // Create a follow-up probe question from the quality assessment
  const quality = state.lastAnswerQuality;
  if (!quality?.followUp) {
    return { phase: "probe_skipped" };
  }

  const probeQuestion: QuestionOutput = {
    text: quality.followUp,
    options: ["Let me elaborate...", "I'd rather skip this"],
    context:
      "Your previous answer was a bit brief — a specific detail would help me give you a more accurate assessment.",
    transition:
      "Thanks — I'd love a bit more detail to make sure my recommendations are spot-on.",
  };

  return {
    currentQuestion: probeQuestion,
    probeCount: state.probeCount + 1,
    phase: "probe_asked",
  };
}

// ─── Interrupt Nodes (wait for user input) ────────────────────────────────────

function waitForCrawlData() {
  const crawlData = interrupt("Waiting for website crawl data");
  return { crawlData: crawlData as string, phase: "crawl_received" };
}

function waitForDepartments() {
  const departments = interrupt("Waiting for department selection");
  const selected = departments as string[];
  return { selectedDepartments: selected, phase: "departments_selected" };
}

function setupQuestions(state: typeof AuditState.State) {
  const topics = buildQuestionTopics(state.selectedDepartments, state.industry);
  return {
    questionTopics: topics,
    totalQuestions: topics.length,
    phase: "questions_ready",
  };
}

function waitForAnswer() {
  const answer = interrupt("Waiting for user answer");
  return { answers: [answer as string], phase: "answer_received" };
}

// ─── Routers ──────────────────────────────────────────────────────────────────

function questionOrReport(state: typeof AuditState.State): string {
  if (state.questionNumber >= state.totalQuestions) {
    return "generate_report";
  }
  return "next_question";
}

function probeOrContinue(state: typeof AuditState.State): string {
  const quality = state.lastAnswerQuality;
  // Only probe if: answer was vague, we haven't already probed for this question, and max 2 probes total
  if (
    quality?.quality === "vague" &&
    quality?.followUp &&
    state.probeCount < 2
  ) {
    return "probe";
  }
  return "compute_scores";
}

function afterProbeAnswer(state: typeof AuditState.State): string {
  // After a probe answer, always continue (don't probe again)
  if (state.questionNumber >= state.totalQuestions) {
    return "generate_report";
  }
  return "next_question";
}

// ─── Build Graph ──────────────────────────────────────────────────────────────

const workflow = new StateGraph(AuditState)
  // Nodes
  .addNode("greet", greetNode)
  .addNode("wait_for_crawl", waitForCrawlData)
  .addNode("analyze", analyzeNode)
  .addNode("suggest_departments", suggestDepartmentsNode)
  .addNode("wait_for_departments", waitForDepartments)
  .addNode("route_questions", routeQuestions)
  .addNode("ask_question", questionNode)
  .addNode("wait_for_answer", waitForAnswer)
  .addNode("assess_answer", assessAnswerQuality)
  .addNode("probe", generateProbe)
  .addNode("wait_for_probe", waitForAnswer)
  .addNode("compute_scores", computePartialScores)
  .addNode("next_question", questionNode)
  .addNode("generate_report", reportNode)
  // Edges
  .addEdge(START, "greet")
  .addEdge("greet", "wait_for_crawl")
  .addEdge("wait_for_crawl", "analyze")
  .addEdge("analyze", "suggest_departments")
  .addEdge("suggest_departments", "wait_for_departments")
  .addEdge("wait_for_departments", "route_questions")
  .addEdge("route_questions", "ask_question")
  .addEdge("ask_question", "wait_for_answer")
  .addEdge("wait_for_answer", "assess_answer")
  .addConditionalEdges("assess_answer", probeOrContinue, [
    "probe",
    "compute_scores",
  ])
  .addEdge("probe", "wait_for_probe")
  .addEdge("wait_for_probe", "compute_scores")
  .addConditionalEdges("compute_scores", questionOrReport, [
    "next_question",
    "generate_report",
  ])
  .addEdge("next_question", "wait_for_answer")
  .addEdge("generate_report", END);

// ─── Compile with PostgreSQL Checkpointer ─────────────────────────────────────

const checkpointer = PostgresSaver.fromConnString(
  process.env.DATABASE_URL || "postgres://localhost:5432/postgres",
);

// Setup checkpoint tables (idempotent)
checkpointer.setup();

export const auditGraph = workflow.compile({ checkpointer });

export { AuditState };
