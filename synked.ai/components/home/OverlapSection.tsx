"use client";

import { ScrollReveal } from "@/components/shared/ScrollReveal";

export function OverlapSection() {
  return (
    <section
      className="overlap-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "4rem",
        padding: "7rem 3rem",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      {/* Left - Problem */}
      <ScrollReveal direction="left">
        <div>
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
            The Problem
          </span>
          <h2
            className="font-heading"
            style={{
              fontSize: "clamp(2.2rem,3.5vw,3rem)",
              fontWeight: 300,
              lineHeight: 1.2,
              marginBottom: "2rem",
            }}
          >
            Businesses are drowning in tool chaos.
          </h2>
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "0.85rem",
              padding: 0,
              margin: 0,
            }}
          >
            {[
              "Time wasted on repetitive, manual tasks",
              "Disconnected tools that don't talk to each other",
              "High operational & hiring costs",
              "No AI expertise to build & maintain systems",
              "Generic AI tools with zero customization",
            ].map((item) => (
              <li
                key={item}
                style={{
                  fontSize: "0.93rem",
                  paddingLeft: "1.4rem",
                  position: "relative",
                  opacity: 0.78,
                  transition: "opacity .2s, transform .2s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "0.78";
                  e.currentTarget.style.transform = "";
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    color: "var(--color-pistachio)",
                  }}
                >
                  —
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </ScrollReveal>

      {/* Right - Card */}
      <ScrollReveal direction="right">
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              background: "var(--color-espresso)",
              color: "var(--color-bone)",
              padding: "2.8rem",
              borderRadius: 2,
              width: "100%",
            }}
          >
            <p
              className="font-mono"
              style={{
                fontSize: "0.63rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase" as const,
                color: "var(--color-taupe)",
                marginBottom: "1.2rem",
              }}
            >
              The Result
            </p>
            <p
              className="font-heading"
              style={{
                fontSize: "clamp(1.9rem,3.2vw,2.75rem)",
                fontStyle: "italic",
                fontWeight: 300,
                lineHeight: 1.3,
                color: "var(--color-bone)",
                marginBottom: "2.2rem",
                borderLeft: "3px solid var(--color-pistachio)",
                paddingLeft: "1.2rem",
              }}
            >
              "Inefficient operations and underutilized AI potential."
            </p>
            <div
              style={{ display: "flex", alignItems: "baseline", gap: "0.8rem" }}
            >
              <span
                className="font-heading"
                style={{
                  fontSize: "3.6rem",
                  fontWeight: 300,
                  color: "var(--color-pistachio)",
                  lineHeight: 1,
                }}
              >
                73%
              </span>
              <span
                style={{ fontSize: "0.84rem", opacity: 0.65, lineHeight: 1.45 }}
              >
                of SMEs say AI tools haven&apos;t delivered ROI
              </span>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
