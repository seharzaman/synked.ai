"use client";

import { Code2, Link as LinkIcon, Handshake, TrendingUp } from "lucide-react";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

const items = [
  {
    icon: Code2,
    title: "Engineering-Level AI",
    desc: "Custom LLM integrations, RAG pipelines, vector databases; not just ChatGPT wrappers.",
  },
  {
    icon: LinkIcon,
    title: "Deep Integration",
    desc: "We build AI into your actual systems; not alongside them.",
  },
  {
    icon: Handshake,
    title: "Long-Term Partnership",
    desc: "We manage and continuously optimize your AI; not just hand it off after launch.",
  },
  {
    icon: TrendingUp,
    title: "Real ROI",
    desc: "One unified managed system replaces tool chaos + in-house hiring complexity.",
  },
];

export function WhySection() {
  return (
    <section style={{ background: "var(--color-bone)", padding: "7rem 3rem" }}>
      {/* Header */}
      <div style={{ maxWidth: 1200, margin: "0 auto 4rem" }}>
        <ScrollReveal>
          <span
            className="font-mono"
            style={{
              fontSize: "0.63rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase" as const,
              color: "var(--color-emerald)",
              display: "block",
              marginBottom: "0.9rem",
            }}
          >
            Our Edge
          </span>
          <h2
            className="font-heading"
            style={{
              fontSize: "clamp(2.4rem,4vw,3.5rem)",
              fontWeight: 300,
            }}
          >
            Why Synked.ai?
          </h2>
        </ScrollReveal>
      </div>

      {/* Grid */}
      <div
        className="why-grid-home"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "2rem",
        }}
      >
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <ScrollReveal key={item.title} delay={0.05 + i * 0.07}>
              <div
                style={{
                  padding: "2rem",
                  background: "white",
                  borderRadius: 2,
                  border: "1px solid rgba(63,42,28,.08)",
                  transition:
                    "transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = "translateY(-5px)";
                  el.style.boxShadow = "0 12px 36px rgba(63,42,28,.09)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = "";
                  el.style.boxShadow = "";
                }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                  <Icon
                    style={{
                      width: 22,
                      height: 22,
                      color: "var(--color-emerald)",
                    }}
                  />
                </div>
                <h4
                  className="font-heading"
                  style={{
                    fontSize: "1.35rem",
                    fontWeight: 400,
                    marginBottom: "0.6rem",
                  }}
                >
                  {item.title}
                </h4>
                <p
                  style={{
                    fontSize: "0.86rem",
                    opacity: 0.63,
                    lineHeight: 1.67,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
