"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { CTABanner } from "@/components/shared/CTABanner";
import { serviceDeepDive, pricingCards } from "@/data/services";

/* ---------- PAGE HERO ---------- */
function ServicesHero() {
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
        <span
          className="block font-mono uppercase mb-4"
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.18em",
            color: "var(--color-pistachio)",
          }}
        >
          What We Build
        </span>
        <h1
          className="font-heading"
          style={{
            fontSize: "clamp(3.5rem, 7vw, 7rem)",
            fontWeight: 300,
            lineHeight: 1.05,
            margin: "0.5rem 0 1rem",
          }}
        >
          Services that
          <br />
          <em style={{ fontStyle: "italic", color: "var(--color-emerald)" }}>
            move businesses
          </em>
          <br />
          forward.
        </h1>
        <p
          style={{
            fontSize: "1rem",
            color: "var(--color-text-mid)",
            maxWidth: "440px",
            lineHeight: 1.7,
          }}
        >
          Full-stack AI systems designed, deployed, and managed for real-world
          results.
        </p>
      </div>
    </section>
  );
}

/* ---------- VISUALS ---------- */
function ChatVisual() {
  return (
    <div
      style={{
        background: "var(--color-off-white)",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: "8px",
        padding: "1.5rem",
        maxWidth: "320px",
        width: "100%",
        boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ display: "flex", gap: "5px", marginBottom: "1rem" }}>
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#4ade80",
            display: "inline-block",
          }}
        />
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#fbbf24",
            display: "inline-block",
          }}
        />
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#f87171",
            display: "inline-block",
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div
          style={{
            padding: "0.6rem 1rem",
            borderRadius: "18px",
            borderBottomLeftRadius: "4px",
            fontSize: "0.82rem",
            background: "var(--color-emerald)",
            color: "#fff",
            alignSelf: "flex-start",
            maxWidth: "80%",
          }}
        >
          How can I help you today?
        </div>
        <div
          style={{
            padding: "0.6rem 1rem",
            borderRadius: "18px",
            borderBottomRightRadius: "4px",
            fontSize: "0.82rem",
            background: "var(--color-bone)",
            color: "var(--color-espresso)",
            alignSelf: "flex-end",
            maxWidth: "80%",
          }}
        >
          What&apos;s your return policy?
        </div>
        <div
          style={{
            padding: "0.8rem 1rem",
            borderRadius: "18px",
            borderBottomLeftRadius: "4px",
            background: "var(--color-emerald)",
            alignSelf: "flex-start",
            display: "flex",
            gap: "4px",
            alignItems: "center",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              background: "rgba(255,255,255,0.6)",
              borderRadius: "50%",
              display: "inline-block",
              animation: "typingDot 1.2s ease-in-out infinite",
            }}
          />
          <span
            style={{
              width: 6,
              height: 6,
              background: "rgba(255,255,255,0.6)",
              borderRadius: "50%",
              display: "inline-block",
              animation: "typingDot 1.2s ease-in-out infinite 0.2s",
            }}
          />
          <span
            style={{
              width: 6,
              height: 6,
              background: "rgba(255,255,255,0.6)",
              borderRadius: "50%",
              display: "inline-block",
              animation: "typingDot 1.2s ease-in-out infinite 0.4s",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function RAGVisual() {
  const files = [
    "Company Policy v3.pdf",
    "Q4 Report.xlsx",
    "Onboarding Guide.md",
  ];
  return (
    <div
      style={{
        background: "var(--color-emerald)",
        border: "1px solid transparent",
        borderRadius: "8px",
        padding: "1.5rem",
        maxWidth: "320px",
        width: "100%",
        boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        {files.map((f) => (
          <div
            key={f}
            className="font-mono"
            style={{
              fontSize: "0.78rem",
              color: "rgba(255,255,255,0.6)",
              background: "rgba(255,255,255,0.08)",
              padding: "0.5rem 0.8rem",
              borderRadius: "4px",
            }}
          >
            {f}
          </div>
        ))}
        <div
          className="font-mono"
          style={{
            fontSize: "0.78rem",
            color: "var(--color-bone)",
            background: "rgba(235, 220, 198, 0.15)",
            border: "1px solid rgba(235, 220, 198, 0.3)",
            padding: "0.5rem 0.8rem",
            borderRadius: "4px",
          }}
        >
          Indexed → Vector DB
        </div>
      </div>
      <div
        style={{
          textAlign: "center",
          color: "rgba(255,255,255,0.4)",
          fontSize: "1.2rem",
          margin: "0.5rem 0",
        }}
      >
        ↓
      </div>
      <div
        className="font-heading"
        style={{
          textAlign: "center",
          fontSize: "1rem",
          color: "var(--color-bone)",
          fontStyle: "italic",
          padding: "0.6rem",
          border: "1px solid rgba(235,220,198,0.3)",
          borderRadius: "4px",
        }}
      >
        AI with full context
      </div>
    </div>
  );
}

function FlowVisual() {
  const nodes = ["Trigger", "AI Agent", "CRM Update", "Slack Alert"];
  return (
    <div
      style={{
        background: "var(--color-off-white)",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: "8px",
        padding: "1.5rem",
        maxWidth: "320px",
        width: "100%",
        boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "0.5rem",
          justifyContent: "center",
        }}
      >
        {nodes.map((n, i) => (
          <span key={n} style={{ display: "contents" }}>
            {i > 0 && (
              <span
                style={{ color: "var(--color-pistachio)", fontSize: "1rem" }}
              >
                →
              </span>
            )}
            <span
              className="font-mono"
              style={{
                fontSize: "0.7rem",
                padding: "0.5rem 0.8rem",
                border:
                  i === 0
                    ? "1px solid var(--color-emerald)"
                    : "1px solid rgba(0,0,0,0.12)",
                borderRadius: "4px",
                color: i === 0 ? "#fff" : "var(--color-text-mid)",
                background:
                  i === 0 ? "var(--color-emerald)" : "var(--color-off-white)",
              }}
            >
              {n}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function MetricsVisual() {
  const metrics = [
    { label: "Response accuracy", val: "97.3%", width: 97 },
    { label: "Resolved without human", val: "84%", width: 84 },
    { label: "Avg. response time", val: "< 1.2s", width: 60 },
  ];
  return (
    <div
      style={{
        background: "var(--color-emerald)",
        border: "1px solid transparent",
        borderRadius: "8px",
        padding: "1.5rem",
        maxWidth: "320px",
        width: "100%",
        boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
      }}
    >
      {metrics.map((m) => (
        <div key={m.label}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.4rem",
              marginTop: "1rem",
            }}
          >
            <span
              style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.65)" }}
            >
              {m.label}
            </span>
            <span
              className="font-mono"
              style={{ fontSize: "0.75rem", color: "var(--color-bone)" }}
            >
              {m.val}
            </span>
          </div>
          <div
            style={{
              height: "4px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "2px",
              overflow: "hidden",
              marginBottom: "0.5rem",
            }}
          >
            <div
              style={{
                height: "100%",
                background: "var(--color-bone)",
                borderRadius: "2px",
                width: `${m.width}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

const visuals = [ChatVisual, RAGVisual, FlowVisual, MetricsVisual];

/* ---------- SERVICE DEEP DIVE ---------- */
function ServiceDeepDive() {
  return (
    <section style={{ padding: "6rem 5vw", background: "#fff" }}>
      {serviceDeepDive.map((svc, i) => {
        const isReverse = i % 2 === 1;
        const Visual = visuals[i];
        return (
          <div key={svc.id}>
            <div
              id={svc.id}
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr 1fr",
                gap: "3rem",
                padding: "5rem 0",
                alignItems: "start",
                direction: isReverse ? "rtl" : "ltr",
              }}
            >
              {/* Vertical number */}
              <div
                className="font-mono"
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.18em",
                  color: "var(--color-pistachio)",
                  paddingTop: "0.5rem",
                  writingMode: "vertical-lr",
                  transform: "rotate(180deg)",
                  alignSelf: "center",
                  direction: "ltr",
                }}
              >
                {svc.num}
              </div>

              {/* Content */}
              <ScrollReveal direction={isReverse ? "right" : "left"}>
                <div style={{ direction: "ltr" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "1rem",
                      marginBottom: "1.2rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <h2
                      className="font-heading"
                      style={{
                        fontSize: "clamp(2rem, 3.5vw, 3.2rem)",
                        fontWeight: 300,
                        color: "var(--color-espresso)",
                      }}
                    >
                      {svc.title}
                    </h2>
                    <span
                      className="font-mono uppercase"
                      style={{
                        fontSize: "0.62rem",
                        letterSpacing: "0.15em",
                        color: "#fff",
                        background: "var(--color-pistachio)",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "100px",
                      }}
                    >
                      {svc.tag}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      color: "var(--color-text-mid)",
                      lineHeight: 1.75,
                      marginBottom: "2rem",
                      maxWidth: "440px",
                    }}
                  >
                    {svc.desc}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1.5rem",
                    }}
                  >
                    {svc.features.map((f) => {
                      const Icon = f.icon;
                      return (
                        <div
                          key={f.title}
                          style={{
                            display: "flex",
                            gap: "1rem",
                            alignItems: "flex-start",
                          }}
                        >
                          <span
                            style={{
                              flexShrink: 0,
                              paddingTop: "2px",
                              width: "2.5rem",
                            }}
                          >
                            {Icon && (
                              <Icon
                                style={{
                                  width: 20,
                                  height: 20,
                                  color: "var(--color-emerald)",
                                }}
                              />
                            )}
                          </span>
                          <div>
                            <h4
                              className="font-heading"
                              style={{
                                fontSize: "1.1rem",
                                fontWeight: 400,
                                marginBottom: "0.25rem",
                              }}
                            >
                              {f.title}
                            </h4>
                            <p
                              style={{
                                fontSize: "0.85rem",
                                color: "var(--color-text-mid)",
                                lineHeight: 1.6,
                              }}
                            >
                              {f.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ScrollReveal>

              {/* Visual */}
              <ScrollReveal direction={isReverse ? "left" : "right"}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "2rem 0",
                    direction: "ltr",
                  }}
                >
                  <Visual />
                </div>
              </ScrollReveal>
            </div>

            {i < serviceDeepDive.length - 1 && (
              <div style={{ height: "1px", background: "rgba(0,0,0,0.07)" }} />
            )}
          </div>
        );
      })}
    </section>
  );
}

/* ---------- PRICING ---------- */
function PricingSection() {
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
          Business Model
        </span>
        <h2
          className="font-heading"
          style={{
            fontSize: "clamp(3rem, 5vw, 5rem)",
            fontWeight: 300,
            lineHeight: 1.15,
          }}
        >
          Transparent.
          <br />
          <em style={{ fontStyle: "italic", color: "var(--color-emerald)" }}>
            Flexible.
          </em>
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        {pricingCards.map((card, i) => (
          <ScrollReveal key={card.title} delay={i * 0.1}>
            <div
              style={{
                padding: card.featured ? "3.5rem 2.5rem 3rem" : "3rem 2.5rem",
                background: card.featured ? "var(--color-emerald)" : "#fff",
                border: card.featured
                  ? "1px solid transparent"
                  : "1px solid rgba(0,0,0,0.08)",
                borderRadius: "4px",
                position: "relative",
                color: card.featured ? "#fff" : "inherit",
              }}
            >
              {card.featured && (
                <div
                  className="font-mono uppercase"
                  style={{
                    position: "absolute",
                    top: "-12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "var(--color-bone)",
                    color: "var(--color-espresso)",
                    fontSize: "0.62rem",
                    letterSpacing: "0.1em",
                    padding: "0.3rem 1rem",
                    borderRadius: "100px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Most Popular
                </div>
              )}
              <h3
                className="font-heading"
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 300,
                  marginBottom: "0.5rem",
                }}
              >
                {card.title}
              </h3>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: card.featured
                    ? "rgba(255,255,255,0.6)"
                    : "var(--color-text-mid)",
                  marginBottom: "1.5rem",
                  fontStyle: "italic",
                }}
              >
                {card.desc}
              </p>
              <ul
                style={{
                  listStyle: "none",
                  marginBottom: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.7rem",
                  padding: 0,
                }}
              >
                {card.features.map((item) => (
                  <li
                    key={item}
                    style={{
                      fontSize: "0.88rem",
                      paddingLeft: "1.2rem",
                      position: "relative",
                      color: card.featured
                        ? "rgba(255,255,255,0.75)"
                        : "var(--color-text-mid)",
                      lineHeight: 1.5,
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        color: card.featured
                          ? "var(--color-bone)"
                          : "var(--color-pistachio)",
                        fontSize: "0.75rem",
                      }}
                    >
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                style={{
                  display: "inline-block",
                  padding: card.featured ? "0.75rem 2rem" : "0.5rem 0",
                  background: card.featured
                    ? "var(--color-bone)"
                    : "transparent",
                  color: card.featured
                    ? "var(--color-emerald)"
                    : "var(--color-espresso)",
                  border: card.featured
                    ? "1px solid var(--color-bone)"
                    : "none",
                  borderRadius: card.featured ? "4px" : "0",
                  fontSize: "0.9rem",
                  fontWeight: card.featured ? 500 : 400,
                  textDecoration: "none",
                  transition: "all 0.3s",
                  width: card.featured ? "100%" : "auto",
                  textAlign: card.featured ? "center" : "left",
                }}
              >
                {card.cta}
              </Link>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- PAGE ---------- */
export function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServiceDeepDive />
      <PricingSection />
      <CTABanner
        heading="Let's build your AI system."
        sub="Tell us about your business and we'll design the right solution."
        cta="Start the Conversation"
        href="/contact"
      />
    </>
  );
}
