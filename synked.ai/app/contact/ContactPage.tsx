"use client";

import { useState } from "react";
import {
  Mail,
  Clock,
  ArrowRightCircle,
  PhoneCall,
  Layout,
  Rocket,
  Activity,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Send,
  Loader2,
} from "lucide-react";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const SERVICE_OPTIONS = [
  {
    id: "ai-agents",
    label: "AI Agents",
    desc: "Custom support, sales & ops agents",
  },
  {
    id: "rag-systems",
    label: "RAG Knowledge Systems",
    desc: "AI trained on your data",
  },
  {
    id: "workflow-automation",
    label: "Workflow Automation",
    desc: "CRM, Slack, API integrations",
  },
  {
    id: "ai-management",
    label: "AI Management",
    desc: "Monitoring & optimization",
  },
  {
    id: "consultation",
    label: "Strategy Consultation",
    desc: "AI roadmap & planning",
  },
];

const BUDGET_OPTIONS = [
  { value: "under-5k", label: "Under $5K" },
  { value: "5k-15k", label: "$5K – $15K" },
  { value: "15k-50k", label: "$15K – $50K" },
  { value: "50k-plus", label: "$50K+" },
  { value: "not-sure", label: "Not sure yet" },
];

const processSteps = [
  {
    icon: PhoneCall,
    title: "Discovery Call",
    desc: "We understand your business, pain points, and AI goals.",
  },
  {
    icon: Layout,
    title: "System Design",
    desc: "We architect a custom AI solution tailored to your workflows.",
  },
  {
    icon: Rocket,
    title: "Build & Deploy",
    desc: "We build, test, and deploy your AI system into your existing stack.",
  },
  {
    icon: Activity,
    title: "Ongoing Management",
    desc: "We monitor, optimize, and scale, month after month.",
  },
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  companyWebsite: string;
  industry: string;
  title: string;
  message: string;
  serviceInterest: string[];
  budgetRange: string;
}

/* ---------- HERO ---------- */
function ContactHero() {
  return (
    <section
      className="relative overflow-hidden flex items-end"
      style={{
        minHeight: "60vh",
        padding: "calc(var(--nav-h) + 4rem) 5vw 5rem",
        background: "var(--color-off-white)",
      }}
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute"
          style={{
            width: "40vw",
            height: "40vw",
            top: "-10%",
            right: "-5%",
            borderRadius: "60% 40% 70% 30% / 50% 60% 40% 70%",
            filter: "blur(50px)",
            opacity: 0.45,
            background: "radial-gradient(ellipse, #c8d5bc 0%, transparent 70%)",
            animation: "morphBlob 12s ease-in-out infinite",
          }}
        />
        <div
          className="absolute"
          style={{
            width: "30vw",
            height: "30vw",
            bottom: "-10%",
            left: "10%",
            borderRadius: "60% 40% 70% 30% / 50% 60% 40% 70%",
            filter: "blur(50px)",
            opacity: 0.45,
            background: "radial-gradient(ellipse, #ddd5c0 0%, transparent 70%)",
            animation: "morphBlob 10s ease-in-out infinite reverse",
          }}
        />
      </div>

      <div className="relative z-[1]">
        <ScrollReveal>
          <span
            className="inline-block font-mono uppercase tracking-[0.18em] text-pistachio"
            style={{
              fontSize: "0.7rem",
              marginBottom: "1rem",
              display: "block",
            }}
          >
            Let&apos;s Talk
          </span>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h1
            className="font-heading font-light text-espresso"
            style={{
              fontSize: "clamp(3.5rem, 7vw, 7rem)",
              lineHeight: 1.05,
              margin: "0.5rem 0 1rem",
            }}
          >
            Start the
            <br />
            <em style={{ color: "var(--color-emerald)" }}>conversation.</em>
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--color-text-mid, #4a4840)",
              maxWidth: 440,
              lineHeight: 1.7,
              marginTop: "1rem",
            }}
          >
            Tell us about your business. We&apos;ll design an AI system that
            actually delivers.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ---------- PAGE ---------- */
export function ContactPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    companyWebsite: "",
    industry: "",
    title: "",
    message: "",
    serviceInterest: [],
    budgetRange: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [matchedService, setMatchedService] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function updateField(field: keyof FormData, value: string | string[]) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));

    // Smart service matcher
    if (
      field === "serviceInterest" &&
      Array.isArray(value) &&
      value.length > 0
    ) {
      setMatchedService(value[0]);
    }
  }

  function toggleService(id: string) {
    const current = formData.serviceInterest;
    const next = current.includes(id)
      ? current.filter((s) => s !== id)
      : [...current, id];
    updateField("serviceInterest", next);
  }

  function validateStep(): boolean {
    const newErrors: Record<string, string> = {};
    if (step === 0) {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = "Invalid email";
    }
    if (step === 1) {
      if (!formData.company.trim())
        newErrors.company = "Company name is required";
    }
    if (step === 2) {
      if (formData.serviceInterest.length === 0)
        newErrors.serviceInterest = "Select at least one service";
    }
    if (step === 3) {
      if (!formData.message.trim() || formData.message.trim().length < 10)
        newErrors.message =
          "Please tell us a bit more (at least 10 characters)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function nextStep() {
    if (validateStep()) setStep((s) => Math.min(s + 1, 3));
  }

  async function handleSubmit() {
    if (!validateStep()) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/user/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrors({ submit: data.error || "Something went wrong" });
        setSubmitting(false);
        return;
      }

      const data = await res.json();

      // Trigger async qualification (fire and forget)
      if (data.clientId) {
        fetch("/api/user/contact/qualify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clientId: data.clientId }),
        }).catch(() => {});
      }

      setSubmitted(true);
    } catch {
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  const STEPS = [
    { label: "Contact", short: "You" },
    { label: "Company", short: "Company" },
    { label: "Services", short: "Needs" },
    { label: "Details", short: "Details" },
  ];

  return (
    <>
      <ContactHero />

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.2fr",
          gap: "6rem",
          padding: "8rem 5vw",
          background: "var(--color-white, #fff)",
          alignItems: "start",
        }}
        className="max-lg:!grid-cols-1 max-lg:!gap-12"
      >
        {/* Left info — sticky */}
        <div
          style={{ position: "sticky", top: "calc(var(--nav-h) + 2rem)" }}
          className="max-lg:!static"
        >
          <ScrollReveal direction="left">
            <span
              className="inline-block font-mono uppercase tracking-[0.18em] text-pistachio"
              style={{
                fontSize: "0.7rem",
                marginBottom: "1rem",
                display: "block",
              }}
            >
              Reach Out
            </span>
            <h2
              className="font-heading font-light text-espresso"
              style={{
                fontSize: "clamp(2.5rem, 4vw, 3.8rem)",
                lineHeight: 1.2,
                margin: "0.5rem 0 2.5rem",
              }}
            >
              We&apos;d love to
              <br />
              hear from you.
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                marginBottom: "3rem",
                paddingBottom: "3rem",
                borderBottom: "1px solid rgba(0,0,0,0.07)",
              }}
            >
              <ContactInfoItem
                icon={<Mail style={{ width: 13, height: 13 }} />}
                label="Email"
              >
                <a
                  href="mailto:hello@synked.ai"
                  className="text-espresso hover:text-emerald transition-colors"
                  style={{ fontSize: "1rem", textDecoration: "none" }}
                >
                  hello@synked.ai
                </a>
              </ContactInfoItem>
              <ContactInfoItem
                icon={<Clock style={{ width: 13, height: 13 }} />}
                label="Response Time"
              >
                <span className="text-espresso" style={{ fontSize: "1rem" }}>
                  Within 24 hours
                </span>
              </ContactInfoItem>
              <ContactInfoItem
                icon={<ArrowRightCircle style={{ width: 13, height: 13 }} />}
                label="What Happens Next"
              >
                <p
                  className="text-muted-foreground"
                  style={{
                    fontSize: "0.88rem",
                    lineHeight: 1.65,
                    maxWidth: 320,
                    margin: 0,
                  }}
                >
                  We review your message, schedule a discovery call, and outline
                  a custom AI system for your business; no commitment required.
                </p>
              </ContactInfoItem>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.1}>
            <div style={{ marginTop: "2rem" }}>
              <span
                className="inline-block font-mono uppercase tracking-[0.18em] text-pistachio"
                style={{
                  fontSize: "0.7rem",
                  marginBottom: "1.5rem",
                  display: "block",
                }}
              >
                Our Process
              </span>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.2rem",
                }}
              >
                {processSteps.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div
                      key={s.title}
                      style={{
                        display: "flex",
                        gap: "1.2rem",
                        alignItems: "flex-start",
                      }}
                    >
                      <span
                        className="text-pistachio"
                        style={{ paddingTop: "0.25rem", flexShrink: 0 }}
                      >
                        <Icon style={{ width: 16, height: 16 }} />
                      </span>
                      <div>
                        <h5
                          className="font-heading text-espresso"
                          style={{
                            fontSize: "1.05rem",
                            fontWeight: 400,
                            marginBottom: "0.2rem",
                          }}
                        >
                          {s.title}
                        </h5>
                        <p
                          className="text-muted-foreground"
                          style={{
                            fontSize: "0.83rem",
                            lineHeight: 1.6,
                            margin: 0,
                          }}
                        >
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Right — Multi-step Form */}
        <ScrollReveal direction="right">
          <div className="rounded-2xl border border-bone bg-off-white p-8 sm:p-10">
            {submitted ? (
              <SuccessState
                name={formData.name}
                matchedService={matchedService}
              />
            ) : (
              <>
                {/* Step indicator */}
                <div className="flex items-center gap-2 mb-8">
                  {STEPS.map((s, i) => (
                    <div key={s.label} className="flex items-center gap-2">
                      <button
                        onClick={() => i < step && setStep(i)}
                        disabled={i > step}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono transition-all ${
                          i === step
                            ? "bg-emerald text-white"
                            : i < step
                              ? "bg-emerald/10 text-emerald cursor-pointer hover:bg-emerald/20"
                              : "bg-bone/50 text-espresso/30"
                        }`}
                      >
                        {i < step ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <span className="text-[10px]">{i + 1}</span>
                        )}
                        <span className="hidden sm:inline">{s.short}</span>
                      </button>
                      {i < STEPS.length - 1 && (
                        <div
                          className={`h-px w-4 ${i < step ? "bg-emerald/30" : "bg-bone"}`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Smart Match Indicator */}
                {matchedService && step >= 2 && (
                  <div className="mb-6 flex items-center gap-2 rounded-lg bg-emerald/5 border border-emerald/10 px-4 py-2.5 animate-in fade-in duration-300">
                    <Sparkles className="h-4 w-4 text-emerald" />
                    <span className="text-xs text-emerald">
                      Best match:{" "}
                      <strong>
                        {
                          SERVICE_OPTIONS.find((s) => s.id === matchedService)
                            ?.label
                        }
                      </strong>
                    </span>
                  </div>
                )}

                {/* Step 0: Contact Info */}
                {step === 0 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-300">
                    <div>
                      <h3 className="text-lg font-serif font-medium text-espresso mb-1">
                        Your Contact Info
                      </h3>
                      <p className="text-sm text-espresso/50">
                        We&apos;ll use this to get back to you.
                      </p>
                    </div>
                    <FormField label="Full Name" error={errors.name}>
                      <Input
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        placeholder="Jane Smith"
                        className="h-11 border-bone"
                      />
                    </FormField>
                    <FormField label="Work Email" error={errors.email}>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="jane@company.com"
                        className="h-11 border-bone"
                      />
                    </FormField>
                    <FormField label="Phone (optional)">
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="h-11 border-bone"
                      />
                    </FormField>
                    <FormField label="Your Role (optional)">
                      <Input
                        value={formData.title}
                        onChange={(e) => updateField("title", e.target.value)}
                        placeholder="CTO, Head of Operations, Founder..."
                        className="h-11 border-bone"
                      />
                    </FormField>
                  </div>
                )}

                {/* Step 1: Company Details */}
                {step === 1 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-300">
                    <div>
                      <h3 className="text-lg font-serif font-medium text-espresso mb-1">
                        About Your Company
                      </h3>
                      <p className="text-sm text-espresso/50">
                        Help us understand your business.
                      </p>
                    </div>
                    <FormField label="Company Name" error={errors.company}>
                      <Input
                        value={formData.company}
                        onChange={(e) => updateField("company", e.target.value)}
                        placeholder="Acme Inc."
                        className="h-11 border-bone"
                      />
                    </FormField>
                    <FormField label="Website (optional)">
                      <Input
                        type="url"
                        value={formData.companyWebsite}
                        onChange={(e) =>
                          updateField("companyWebsite", e.target.value)
                        }
                        placeholder="https://acme.com"
                        className="h-11 border-bone"
                      />
                    </FormField>
                    <FormField label="Industry (optional)">
                      <Input
                        value={formData.industry}
                        onChange={(e) =>
                          updateField("industry", e.target.value)
                        }
                        placeholder="SaaS, Healthcare, E-commerce..."
                        className="h-11 border-bone"
                      />
                    </FormField>
                  </div>
                )}

                {/* Step 2: Services & Budget */}
                {step === 2 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-300">
                    <div>
                      <h3 className="text-lg font-serif font-medium text-espresso mb-1">
                        What Do You Need?
                      </h3>
                      <p className="text-sm text-espresso/50">
                        Select all that apply.
                      </p>
                    </div>
                    <FormField label="Services" error={errors.serviceInterest}>
                      <div className="grid gap-2">
                        {SERVICE_OPTIONS.map((service) => {
                          const selected = formData.serviceInterest.includes(
                            service.id,
                          );
                          return (
                            <button
                              key={service.id}
                              type="button"
                              onClick={() => toggleService(service.id)}
                              className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                                selected
                                  ? "border-emerald bg-emerald/5 shadow-sm"
                                  : "border-bone bg-white hover:border-emerald/30"
                              }`}
                            >
                              <div
                                className={`mt-0.5 h-4 w-4 rounded-sm border-2 flex items-center justify-center transition-all ${
                                  selected
                                    ? "border-emerald bg-emerald"
                                    : "border-bone"
                                }`}
                              >
                                {selected && (
                                  <CheckCircle2 className="h-3 w-3 text-white" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-espresso">
                                  {service.label}
                                </p>
                                <p className="text-xs text-espresso/50">
                                  {service.desc}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </FormField>
                    <FormField label="Budget Range">
                      <div className="flex flex-wrap gap-2">
                        {BUDGET_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() =>
                              updateField("budgetRange", opt.value)
                            }
                            className={`rounded-full border px-4 py-2 text-xs font-mono transition-all ${
                              formData.budgetRange === opt.value
                                ? "border-emerald bg-emerald/5 text-emerald"
                                : "border-bone text-espresso/60 hover:border-emerald/30"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </FormField>
                  </div>
                )}

                {/* Step 3: Message */}
                {step === 3 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-300">
                    <div>
                      <h3 className="text-lg font-serif font-medium text-espresso mb-1">
                        Tell Us More
                      </h3>
                      <p className="text-sm text-espresso/50">
                        What are your goals? Any specific pain points?
                      </p>
                    </div>
                    <FormField label="Your Message" error={errors.message}>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => updateField("message", e.target.value)}
                        placeholder="We're looking to automate our customer support workflow. Currently handling 500+ tickets/day manually and need AI to triage and respond to common questions..."
                        rows={6}
                        className="border-bone resize-none"
                      />
                    </FormField>
                    {errors.submit && (
                      <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                        {errors.submit}
                      </p>
                    )}
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-bone">
                  {step > 0 ? (
                    <Button
                      variant="ghost"
                      onClick={() => setStep((s) => s - 1)}
                      className="text-espresso/60"
                    >
                      <ArrowLeft className="mr-1.5 h-4 w-4" />
                      Back
                    </Button>
                  ) : (
                    <div />
                  )}
                  {step < 3 ? (
                    <Button
                      onClick={nextStep}
                      className="bg-emerald text-white hover:bg-emerald-lt"
                    >
                      Continue
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="bg-emerald text-white hover:bg-emerald-lt"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-1.5 h-4 w-4" />
                          Submit
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}

/* ---------- HELPER COMPONENTS ---------- */

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-mono uppercase tracking-wider text-espresso/50 mb-1.5 block">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function ContactInfoItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
      <span
        className="font-mono uppercase text-pistachio"
        style={{
          fontSize: "0.62rem",
          letterSpacing: "0.15em",
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        {icon}
        {label}
      </span>
      {children}
    </div>
  );
}

function SuccessState({
  name,
  matchedService,
}: {
  name: string;
  matchedService: string | null;
}) {
  return (
    <div className="text-center py-12 animate-in fade-in zoom-in-95 duration-500">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald/10">
        <CheckCircle2 className="h-8 w-8 text-emerald" />
      </div>
      <h3 className="text-xl font-serif font-medium text-espresso mb-2">
        Thank you, {name.split(" ")[0]}!
      </h3>
      <p className="text-sm text-espresso/50 max-w-sm mx-auto mb-6">
        We&apos;ve received your message and will get back to you within 24
        hours with a personalized plan.
      </p>

      {matchedService && (
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald/5 border border-emerald/10 px-4 py-2 mb-6">
          <Sparkles className="h-4 w-4 text-emerald" />
          <span className="text-xs text-emerald font-medium">
            Recommended:{" "}
            {SERVICE_OPTIONS.find((s) => s.id === matchedService)?.label}
          </span>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-bone">
        <p className="text-xs text-espresso/40 font-mono uppercase tracking-wider mb-3">
          While you wait
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/business-audit"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-bone px-4 py-2.5 text-sm text-espresso hover:border-emerald/30 hover:bg-emerald/5 transition-all"
          >
            <Activity className="h-4 w-4" />
            Take a Free Business Audit
          </a>
          <a
            href="/services"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-bone px-4 py-2.5 text-sm text-espresso hover:border-emerald/30 hover:bg-emerald/5 transition-all"
          >
            <ArrowRight className="h-4 w-4" />
            Explore Our Services
          </a>
        </div>
      </div>
    </div>
  );
}
