import {
  Code2,
  Handshake,
  Lightbulb,
  TrendingUp,
  BrainCircuit,
  Code,
  Briefcase,
  CheckCircle,
  Clock,
  Star,
} from "lucide-react";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { CTABanner } from "@/components/shared/CTABanner";

/* ---------- PAGE HERO ---------- */
function AboutHero() {
  return (
    <section
      className="relative overflow-hidden flex items-end"
      style={{
        minHeight: "60vh",
        padding: "calc(var(--nav-h) + 4rem) 5vw 5rem",
        background: "var(--color-off-white)",
      }}
    >
      {/* Background blobs */}
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
        <span
          className="block font-mono uppercase mb-4"
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.18em",
            color: "var(--color-pistachio)",
          }}
        >
          Our Story
        </span>
        <h1
          className="font-heading"
          style={{
            fontSize: "clamp(3.5rem, 7vw, 7rem)",
            fontWeight: 300,
            lineHeight: 1.05,
            maxWidth: "700px",
            margin: "0.5rem 0 1rem",
          }}
        >
          We synk businesses
          <br />
          <em style={{ fontStyle: "italic", color: "var(--color-emerald)" }}>
            with the future
          </em>
          <br />
          of intelligence.
        </h1>
      </div>
    </section>
  );
}

/* ---------- MISSION ---------- */
function MissionSection() {
  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "6rem",
        padding: "8rem 5vw",
        background: "var(--color-white, #fff)",
        alignItems: "start",
      }}
    >
      <div className="lg:sticky" style={{ top: "calc(var(--nav-h) + 2rem)" }}>
        <ScrollReveal direction="left">
          <span
            className="block font-mono uppercase mb-4"
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.18em",
              color: "var(--color-pistachio)",
            }}
          >
            Mission
          </span>
          <p
            className="font-heading"
            style={{
              fontSize: "clamp(1.4rem, 2.5vw, 2.2rem)",
              fontWeight: 300,
              fontStyle: "italic",
              lineHeight: 1.5,
              color: "var(--color-emerald)",
              borderLeft: "3px solid var(--color-pistachio)",
              paddingLeft: "1.5rem",
              marginTop: "0.5rem",
            }}
          >
            &ldquo;To help businesses synk their operations with intelligent AI
            agents that are not only built, but continuously optimized and
            managed by experts.&rdquo;
          </p>
        </ScrollReveal>
      </div>
      <ScrollReveal direction="right">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            paddingTop: "3rem",
          }}
        >
          <p
            style={{
              fontSize: "1.05rem",
              color: "var(--color-text-mid)",
              lineHeight: 1.8,
            }}
          >
            We founded Synked.ai with a simple observation: most businesses{" "}
            <em
              style={{
                color: "var(--color-emerald)",
                fontStyle: "normal",
                fontWeight: 500,
              }}
            >
              want
            </em>{" "}
            to benefit from AI, but the path from intention to actual results is
            full of dead ends, including generic tools, disconnected systems,
            and no one accountable for outcomes.
          </p>
          <p
            style={{
              fontSize: "1.05rem",
              color: "var(--color-text-mid)",
              lineHeight: 1.8,
            }}
          >
            We exist to close that gap. We&apos;re not a tool. We&apos;re not a
            course. We&apos;re the team that builds, deploys, and continuously
            manages the AI infrastructure your business needs to scale.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}

/* ---------- VISION ---------- */
function VisionSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--color-emerald)", padding: "8rem 5vw" }}
    >
      {/* Radial gradient accent */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-30%",
          right: "-10%",
          width: "50vw",
          height: "50vw",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(127,140,67,0.2) 0%, transparent 70%)",
        }}
      />
      <ScrollReveal>
        <div className="relative z-[1]" style={{ maxWidth: "800px" }}>
          <span
            className="block font-mono uppercase mb-4"
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.18em",
              color: "rgba(235,220,198,0.6)",
            }}
          >
            Vision
          </span>
          <h2
            className="font-heading"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 5rem)",
              fontWeight: 300,
              lineHeight: 1.15,
              color: "var(--color-bone)",
              marginTop: "0.5rem",
            }}
          >
            To become a leading provider of AI-driven business automation
            solutions:{" "}
            <em style={{ fontStyle: "italic", color: "#fff" }}>globally.</em>
          </h2>
        </div>
      </ScrollReveal>
    </section>
  );
}

/* ---------- VALUES ---------- */
const values = [
  {
    icon: Code2,
    title: "Engineering, not wrappers.",
    desc: "We build real AI systems such as custom LLM integrations, vector databases, multi-agent pipelines. Not just ChatGPT with a new interface.",
  },
  {
    icon: Handshake,
    title: "Partnership over projects.",
    desc: "We stay. We manage. We improve. Our success is measured by your outcomes, not our delivery date.",
  },
  {
    icon: Lightbulb,
    title: "Clarity over complexity.",
    desc: "AI is complex; your experience of it shouldn't be. We translate technical depth into simple, measurable business results.",
  },
  {
    icon: TrendingUp,
    title: "Outcomes, not outputs.",
    desc: 'We track resolution rates, cost savings, and time recaptured, not just "deployments."',
  },
];

function ValuesSection() {
  return (
    <section
      style={{ padding: "8rem 5vw", background: "var(--color-off-white)" }}
    >
      <div style={{ marginBottom: "4rem" }}>
        <span
          className="block font-mono uppercase mb-4"
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.18em",
            color: "var(--color-pistachio)",
          }}
        >
          What Drives Us
        </span>
        <h2
          className="font-heading"
          style={{
            fontSize: "clamp(3rem, 5vw, 5rem)",
            fontWeight: 300,
          }}
        >
          Our values
        </h2>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "2px",
        }}
      >
        {values.map((v) => {
          const Icon = v.icon;
          return (
            <ScrollReveal key={v.title} className="h-full">
              <div
                className="group"
                style={{
                  background: "#fff",
                  padding: "3rem",
                  position: "relative",
                  overflow: "hidden",
                  transition: "background 0.3s",
                  cursor: "default",
                  height: "100%",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.background = "var(--color-emerald)";
                  el.querySelectorAll("h3, p").forEach(
                    (c) => ((c as HTMLElement).style.color = "#fff"),
                  );
                  el.querySelector(".vi-icon")!
                    .querySelectorAll("svg")
                    .forEach((s) => (s.style.color = "#fff"));
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.background = "#fff";
                  el.querySelectorAll("h3").forEach(
                    (c) => ((c as HTMLElement).style.color = ""),
                  );
                  el.querySelectorAll("p").forEach(
                    (c) =>
                      ((c as HTMLElement).style.color = "var(--color-text-mid)"),
                  );
                  el.querySelector(".vi-icon")!
                    .querySelectorAll("svg")
                    .forEach((s) => (s.style.color = "var(--color-emerald)"));
                }}
              >
                <div
                  className="vi-icon"
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "2rem",
                    transition: "color 0.3s",
                  }}
                >
                  <Icon
                    style={{
                      width: 20,
                      height: 20,
                      color: "var(--color-emerald)",
                    }}
                  />
                </div>
                <h3
                  className="font-heading"
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 400,
                    marginBottom: "0.8rem",
                    transition: "color 0.3s",
                  }}
                >
                  {v.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--color-text-mid)",
                    lineHeight: 1.7,
                    maxWidth: "360px",
                    transition: "color 0.3s",
                  }}
                >
                  {v.desc}
                </p>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- TEAM ---------- */
const team = [
  {
    icon: BrainCircuit,
    role: "AI / ML Engineer",
    area: "Architecture & Intelligence",
    bio: "Custom LLM integrations, RAG pipeline design, prompt engineering, and fine-tuning strategy. The technical core of every system we build.",
    colorClass: "ai",
    bg: "var(--color-emerald)",
  },
  {
    icon: Code,
    role: "Software Developers",
    area: "Integration & Deployment",
    bio: "Backend engineering, API integrations, secure deployment, and scalable infrastructure. They turn AI architectures into production-grade systems.",
    colorClass: "dev",
    bg: "var(--color-pistachio)",
  },
  {
    icon: Briefcase,
    role: "Business Development",
    area: "Strategy & Partnerships",
    bio: "Understanding your business deeply, designing the right solution scope, and ensuring every engagement delivers clear, measurable ROI.",
    colorClass: "bd",
    bg: "var(--color-espresso)",
  },
];

function TeamSection() {
  return (
    <section style={{ padding: "8rem 5vw", background: "#fff" }}>
      <div style={{ marginBottom: "4rem" }}>
        <span
          className="block font-mono uppercase mb-4"
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.18em",
            color: "var(--color-pistachio)",
          }}
        >
          The Team
        </span>
        <h2
          className="font-heading"
          style={{
            fontSize: "clamp(2.5rem, 4vw, 4rem)",
            fontWeight: 300,
            lineHeight: 1.2,
          }}
        >
          Expert humans
          <br />
          building expert{" "}
          <em style={{ fontStyle: "italic", color: "var(--color-emerald)" }}>
            machines.
          </em>
        </h2>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "2rem",
        }}
      >
        {team.map((t, i) => {
          const Icon = t.icon;
          return (
            <ScrollReveal key={t.role} delay={i * 0.12}>
              <div
                style={{
                  border: "1px solid rgba(0,0,0,0.07)",
                  borderRadius: "4px",
                  overflow: "hidden",
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 50px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                {/* Avatar area */}
                <div
                  style={{
                    height: "180px",
                    background: "var(--color-off-white)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "50%",
                      background:
                        "linear-gradient(to top, var(--color-off-white), transparent)",
                    }}
                  />
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: t.bg,
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <Icon style={{ width: 28, height: 28, color: "#fff" }} />
                  </div>
                </div>
                {/* Info */}
                <div style={{ padding: "1.5rem 2rem 2rem" }}>
                  <h4
                    className="font-heading"
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: 400,
                      marginBottom: "0.25rem",
                    }}
                  >
                    {t.role}
                  </h4>
                  <p
                    className="font-mono uppercase"
                    style={{
                      fontSize: "0.65rem",
                      letterSpacing: "0.12em",
                      color: "var(--color-pistachio)",
                      marginBottom: "0.8rem",
                    }}
                  >
                    {t.area}
                  </p>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--color-text-mid)",
                      lineHeight: 1.65,
                    }}
                  >
                    {t.bio}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- ROADMAP ---------- */
const phases = [
  {
    phase: "Phase 1",
    title: "Managed AI Services",
    desc: "Agency model, building and managing custom AI systems for businesses across verticals.",
    status: "Now",
    icon: CheckCircle,
    statusBg: "var(--color-emerald)",
    statusColor: "#fff",
    active: true,
  },
  {
    phase: "Phase 2",
    title: "Productized Solutions",
    desc: "Packaged, repeatable AI solutions by industry, faster deployment, proven results.",
    status: "Coming Soon",
    icon: Clock,
    statusBg: "var(--color-pistachio)",
    statusColor: "#fff",
    active: false,
  },
  {
    phase: "Phase 3",
    title: "SaaS Platform",
    desc: "A self-serve platform with managed agents, AI infrastructure for every business, at scale.",
    status: "Future",
    icon: Star,
    statusBg: "var(--color-bone)",
    statusColor: "var(--color-espresso)",
    active: false,
  },
];

function RoadmapSection() {
  return (
    <section
      style={{ padding: "8rem 5vw", background: "var(--color-off-white)" }}
    >
      <div style={{ marginBottom: "4rem" }}>
        <span
          className="block font-mono uppercase mb-4"
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.18em",
            color: "var(--color-pistachio)",
          }}
        >
          Growth Plan
        </span>
        <h2
          className="font-heading"
          style={{
            fontSize: "clamp(3rem, 5vw, 5rem)",
            fontWeight: 300,
            lineHeight: 1.15,
          }}
        >
          Where we&apos;re
          <br />
          going.
        </h2>
      </div>
      <div
        style={{ display: "flex", flexDirection: "column", maxWidth: "700px" }}
      >
        {phases.map((p) => {
          const StatusIcon = p.icon;
          return (
            <ScrollReveal key={p.phase}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "100px 1fr",
                  gap: "2rem",
                  padding: "2.5rem 0",
                  borderBottom: "1px solid rgba(0,0,0,0.07)",
                  position: "relative",
                }}
              >
                {/* Vertical line */}
                <div
                  style={{
                    position: "absolute",
                    left: "90px",
                    top: 0,
                    bottom: 0,
                    width: "1px",
                    background: "rgba(0,0,0,0.07)",
                  }}
                />
                <div
                  className="font-mono uppercase"
                  style={{
                    fontSize: "0.65rem",
                    letterSpacing: "0.15em",
                    color: p.active
                      ? "var(--color-emerald)"
                      : "var(--color-text-mid)",
                    paddingTop: "0.3rem",
                    alignSelf: "start",
                  }}
                >
                  {p.phase}
                </div>
                <div>
                  <h4
                    className="font-heading"
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 400,
                      marginBottom: "0.5rem",
                    }}
                  >
                    {p.title}
                  </h4>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--color-text-mid)",
                      lineHeight: 1.65,
                      marginBottom: "0.8rem",
                    }}
                  >
                    {p.desc}
                  </p>
                  <span
                    className="font-mono uppercase inline-flex items-center"
                    style={{
                      fontSize: "0.62rem",
                      letterSpacing: "0.12em",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "100px",
                      background: p.statusBg,
                      color: p.statusColor,
                    }}
                  >
                    <StatusIcon
                      style={{ width: 12, height: 12, marginRight: 3 }}
                    />
                    {p.status}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- PAGE ---------- */
export function AboutPage() {
  return (
    <>
      <AboutHero />
      <MissionSection />
      <VisionSection />
      <ValuesSection />
      <TeamSection />
      <RoadmapSection />
      <CTABanner
        heading="Work with us."
        sub="Let's understand your business and design the right AI system."
        cta="Get in Touch"
        href="/contact"
      />
    </>
  );
}
