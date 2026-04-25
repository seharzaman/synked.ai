import { useState } from "react";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

const pills = [
  "E-commerce",
  "Healthcare",
  "Real Estate",
  "Education",
  "Startups & SMEs",
  "Agencies",
];

export function IndustriesSection() {
  const [active, setActive] = useState<Set<string>>(
    new Set(["Healthcare", "Education", "Agencies"]),
  );

  const toggle = (pill: string) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(pill)) next.delete(pill);
      else next.add(pill);
      return next;
    });
  };

  return (
    <section style={{ padding: "7rem 3rem", maxWidth: 1200, margin: "0 auto" }}>
      {/* Label */}
      <div style={{ marginBottom: "2.5rem" }}>
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
            Who We Serve
          </span>
          <h2
            className="font-heading"
            style={{
              fontSize: "clamp(2.4rem,4vw,3.5rem)",
              fontWeight: 300,
              lineHeight: 1.2,
            }}
          >
            Built for businesses
            <br />
            <em style={{ fontStyle: "italic", color: "var(--color-emerald)" }}>
              ready to scale.
            </em>
          </h2>
        </ScrollReveal>
      </div>

      {/* Pills */}
      <ScrollReveal delay={0.1}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.8rem",
            marginBottom: "2rem",
          }}
        >
          {pills.map((pill) => {
            const isActive = active.has(pill);
            return (
              <div
                key={pill}
                onClick={() => toggle(pill)}
                style={{
                  padding: "0.5rem 1.2rem",
                  border: `1px solid ${isActive ? "var(--color-emerald)" : "rgba(63,42,28,.18)"}`,
                  borderRadius: 100,
                  fontSize: "0.85rem",
                  transition: "all .25s",
                  cursor: "pointer",
                  background: isActive ? "var(--color-emerald)" : "transparent",
                  color: isActive ? "white" : "inherit",
                }}
              >
                {pill}
              </div>
            );
          })}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <p style={{ fontSize: "0.93rem", opacity: 0.62 }}>
          Ideal clients are businesses that want{" "}
          <strong>results from AI</strong>, not just access to tools.
        </p>
      </ScrollReveal>
    </section>
  );
}
