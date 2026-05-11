import { Users, Cpu, Zap, BarChart2, Headphones } from "lucide-react";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { PulseCanvas } from "./PulseCanvas";

const nodes = [
  { icon: Users, label: "Customer Data", sub: "Contacts & history" },
  { icon: Cpu, label: "AI Agent", sub: "Smart routing" },
  { icon: Zap, label: "Automation", sub: "No-code flows" },
  { icon: BarChart2, label: "Analytics", sub: "Live reporting" },
  { icon: Headphones, label: "Support", sub: "24 / 7 coverage" },
];

export function PulseSection() {
  return (
    <section
      style={{
        background: "var(--color-espresso)",
        padding: "6rem 3rem 5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "3.5rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        <ScrollReveal>
          <h2
            className="font-heading"
            style={{
              fontSize: "clamp(2.4rem,4vw,3.6rem)",
              fontWeight: 300,
              color: "var(--color-bone)",
              lineHeight: 1.2,
            }}
          >
            We bring your systems
            <br />
            <em
              style={{ fontStyle: "italic", color: "var(--color-pistachio)" }}
            >
              into synk.
            </em>
          </h2>
        </ScrollReveal>
      </div>

      {/* Canvas wrap */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 940,
          margin: "0 auto 3rem",
        }}
      >
        <PulseCanvas />
      </div>

      {/* Nodes */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1.6rem",
          flexWrap: "wrap",
          maxWidth: 940,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        {nodes.map((node, i) => {
          const Icon = node.icon;
          return (
            <ScrollReveal key={node.label} delay={i * 0.1}>
              <div
                className="pulse-node"
                data-pulse-node
                style={{
                  background: "rgba(235,220,200,.055)",
                  border: "1px solid rgba(235,220,200,.12)",
                  borderRadius: 3,
                  padding: "1.5rem 1.6rem",
                  textAlign: "center",
                  minWidth: 148,
                  position: "relative",
                  overflow: "hidden",
                  cursor: "default",
                  transition: "all .35s cubic-bezier(.16,1,.3,1)",
                }}
              >
                {/* Top accent bar (::before equivalent) */}
                <span
                  className="pulse-node-bar"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background:
                      "linear-gradient(90deg,transparent,var(--color-pistachio),transparent)",
                    transform: "scaleX(0)",
                    transformOrigin: "center",
                    transition: "transform .4s",
                  }}
                />
                <span
                  className="pulse-node-icon"
                  style={{
                    fontSize: "1.3rem",
                    marginBottom: "0.7rem",
                    display: "block",
                    filter: "grayscale(.4)",
                    transition: "filter .35s",
                  }}
                >
                  <Icon style={{ width: 18, height: 18, color: "#7F8C43" }} />
                </span>
                <div
                  className="pulse-node-title font-mono"
                  style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase" as const,
                    color: "var(--color-bone)",
                    opacity: 0.55,
                    transition: "opacity .35s, color .35s",
                  }}
                >
                  {node.label}
                </div>
                <div
                  className="pulse-node-sub"
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--color-bone)",
                    opacity: 0.35,
                    marginTop: "0.35rem",
                    lineHeight: 1.4,
                    transition: "opacity .35s",
                  }}
                >
                  {node.sub}
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
