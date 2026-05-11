"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Monitor,
  Wrench,
  TrendingUp,
  CircleDot,
  ArrowRight,
  BarChart2,
  ShieldCheck,
} from "lucide-react";
import { DisclaimerBanner } from "@/components/shared/DisclaimerBanner";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { agents, type Agent } from "@/data/agents";

/* ---------- helpers ---------- */
const sCol = (s: string) =>
  s === "ok" ? "#4CAF50" : s === "degraded" ? "#FFC107" : "#F44336";
const sLbl = (s: string) =>
  s === "ok" ? "Healthy" : s === "degraded" ? "Degraded" : "Failing";
const lCol = (v: number | null) =>
  v === null
    ? "#F44336"
    : v < 600
      ? "#4CAF50"
      : v < 1300
        ? "#FFC107"
        : "#F44336";
const scCol = (v: number) =>
  v >= 97 ? "#4CAF50" : v >= 88 ? "#FFC107" : "#F44336";
const uCol = (v: number) =>
  v >= 99 ? "#4CAF50" : v >= 95 ? "#FFC107" : "#F44336";
const eCol = (v: number) =>
  v > 30 ? "#F44336" : v > 8 ? "#FFC107" : "#4CAF50";

interface AgentState {
  lat: number | null;
  success: number;
  errors: number;
  uptime: number;
  status: Agent["status"];
  fixing: boolean;
  fixed: boolean;
  step: number;
}

export function DemoDashboardPage() {
  const [state, setState] = useState<Record<string, AgentState>>(() => {
    const s: Record<string, AgentState> = {};
    agents.forEach((a) => {
      s[a.id] = {
        lat: a.lat,
        success: a.success,
        errors: a.errors,
        uptime: a.uptime,
        status: a.status,
        fixing: false,
        fixed: false,
        step: -1,
      };
    });
    return s;
  });
  const [openId, setOpenId] = useState<string | null>(null);
  const [clock, setClock] = useState("");
  const fixTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // Clock
  useEffect(() => {
    const tick = () =>
      setClock(new Date().toLocaleTimeString("en-US", { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Live jitter for healthy agents
  useEffect(() => {
    const id = setInterval(() => {
      setState((prev) => {
        const next = { ...prev };
        agents.forEach((a) => {
          const st = next[a.id];
          if (st.status === "ok" && !st.fixing) {
            next[a.id] = {
              ...st,
              lat:
                a.lat !== null
                  ? a.lat + Math.round((Math.random() - 0.5) * 28)
                  : null,
              success: parseFloat(
                (a.success + (Math.random() - 0.5) * 0.35).toFixed(1),
              ),
            };
          }
        });
        return next;
      });
    }, 3200);
    return () => clearInterval(id);
  }, []);

  const startFix = useCallback((agentId: string) => {
    const agent = agents.find((a) => a.id === agentId);
    if (!agent || !agent.fixSteps) return;

    setState((prev) => ({
      ...prev,
      [agentId]: { ...prev[agentId], fixing: true, step: 0 },
    }));

    const total = agent.fixSteps.length;

    const runStep = (step: number) => {
      setState((prev) => {
        const st = prev[agentId];
        const p = step / total;
        const newLat = agent.fixed
          ? Math.round(
              (agent.lat ?? agent.fixed.lat) +
                (agent.fixed.lat - (agent.lat ?? agent.fixed.lat)) * p,
            )
          : st.lat;
        const newSuccess = agent.fixed
          ? parseFloat(
              (
                agent.success +
                (agent.fixed.success - agent.success) * p
              ).toFixed(1),
            )
          : st.success;
        const newErrors = agent.fixed
          ? Math.round(agent.errors + (agent.fixed.errors - agent.errors) * p)
          : st.errors;
        const newUptime = agent.fixed
          ? parseFloat(
              (agent.uptime + (agent.fixed.uptime - agent.uptime) * p).toFixed(
                1,
              ),
            )
          : st.uptime;

        return {
          ...prev,
          [agentId]: {
            ...st,
            step,
            lat: newLat,
            success: newSuccess,
            errors: newErrors,
            uptime: newUptime,
          },
        };
      });

      if (step + 1 < total) {
        fixTimers.current[agentId] = setTimeout(() => runStep(step + 1), 1300);
      } else {
        fixTimers.current[agentId] = setTimeout(() => {
          setState((prev) => ({
            ...prev,
            [agentId]: {
              ...prev[agentId],
              fixing: false,
              fixed: true,
              step: total,
              status: "ok",
              lat: agent.fixed?.lat ?? prev[agentId].lat,
              success: agent.fixed?.success ?? prev[agentId].success,
              errors: agent.fixed?.errors ?? prev[agentId].errors,
              uptime: agent.fixed?.uptime ?? prev[agentId].uptime,
            },
          }));
        }, 1000);
      }
    };

    runStep(0);
  }, []);

  // Cleanup timers
  useEffect(() => {
    return () => {
      Object.values(fixTimers.current).forEach(clearTimeout);
    };
  }, []);

  // Summary stats
  const vals = Object.values(state);
  const okCount = vals.filter((v) => v.status === "ok").length;
  const warnCount = vals.filter((v) => v.status === "degraded").length;
  const errCount = vals.filter((v) => v.status === "failing").length;
  const avgUptime = (
    vals.reduce((s, v) => s + v.uptime, 0) / vals.length
  ).toFixed(1);

  return (
    <div className="bg-night text-bone min-h-screen">
      <DisclaimerBanner>
        <strong className="text-emerald">
          Concept demo — not a real data tool.
        </strong>{" "}
        This dashboard illustrates how we monitor and fix your AI agents in
        production. All agents, metrics and fix steps shown are simulated
        examples.
      </DisclaimerBanner>

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--color-night)", padding: "4.5rem 5vw 3rem" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_60%,rgba(18,88,66,0.2)_0%,transparent_55%)] pointer-events-none" />
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          <span
            className="font-mono uppercase text-pistachio"
            style={{
              fontSize: "0.63rem",
              letterSpacing: "0.22em",
              display: "block",
              marginBottom: "0.9rem",
            }}
          >
            Health Monitor
          </span>
          <h1
            className="font-heading font-light"
            style={{
              fontSize: "clamp(2.6rem, 5.5vw, 4.5rem)",
              lineHeight: 1.1,
              color: "var(--color-bone)",
              marginBottom: "1rem",
            }}
          >
            Agent Health
            <br />
            <em style={{ fontStyle: "italic", color: "var(--color-night-hi)" }}>
              Dashboard
            </em>
          </h1>
          <p
            style={{
              fontSize: "0.98rem",
              color: "rgba(235,220,200,0.5)",
              maxWidth: 520,
              lineHeight: 1.75,
              marginBottom: "1.5rem",
            }}
          >
            Real-time visibility across every agent. Click a degraded or failing
            agent, hit Apply Fixes, and watch the metrics recover, step by step.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {[
              { icon: CircleDot, label: "Live Status" },
              { icon: ArrowRight, label: "Step-by-Step Recovery" },
              { icon: BarChart2, label: "Live Metric Updates" },
              { icon: ShieldCheck, label: "Incident Resolution" },
            ].map((chip) => {
              const Icon = chip.icon;
              return (
                <span
                  key={chip.label}
                  style={{
                    background: "rgba(235,220,200,0.06)",
                    border: "1px solid var(--color-night-bord)",
                    color: "var(--color-night-mono)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.59rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "0.33rem 0.75rem",
                    borderRadius: 2,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <Icon style={{ width: 11, height: 11 }} /> {chip.label}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* Explainer */}
      <section
        style={{
          background: "var(--color-espresso)",
          padding: "3rem 5vw",
          borderBottom: "1px solid rgba(235,220,200,0.05)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.4rem",
          }}
        >
          {[
            {
              icon: Monitor,
              title: "What you're seeing",
              desc: "A live control panel for your deployed AI agents. Each row shows real-time health, latency, error rate and uptime, exactly how we monitor your systems.",
            },
            {
              icon: Wrench,
              title: "Click to fix — for real",
              desc: "Click any Degraded or Failing agent. Hit Apply Fixes and watch: each step runs, the progress bar fills, and the metrics on that row visibly recover. Green means fixed.",
            },
            {
              icon: TrendingUp,
              title: "What this means for you",
              desc: "You won't touch any of this. We watch it 24/7, catch issues before they hit your users, and push fixes, all within our managed service. You get a report.",
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                style={{
                  background: "rgba(235,220,200,0.05)",
                  border: "1px solid rgba(235,220,200,0.08)",
                  borderRadius: 4,
                  padding: "1.5rem",
                }}
              >
                <div style={{ fontSize: "1.4rem", marginBottom: "0.65rem" }}>
                  <Icon
                    style={{
                      width: 20,
                      height: 20,
                      color: "var(--color-pistachio)",
                    }}
                  />
                </div>
                <h4
                  className="font-heading"
                  style={{
                    fontSize: "1.15rem",
                    color: "var(--color-bone)",
                    marginBottom: "0.45rem",
                  }}
                >
                  {card.title}
                </h4>
                <p
                  style={{
                    fontSize: "0.83rem",
                    color: "rgba(235,220,200,0.52)",
                    lineHeight: 1.6,
                  }}
                >
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Dashboard Section */}
      <section
        style={{ padding: "4rem 5vw 5rem", background: "var(--color-night)" }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: "1.8rem" }}>
            <span
              className="font-mono uppercase text-night-mono"
              style={{
                fontSize: "0.58rem",
                letterSpacing: "0.14em",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              Live Demo — Simulated Data
            </span>
            <h2
              className="font-heading font-light"
              style={{
                fontSize: "clamp(1.7rem, 3vw, 2.4rem)",
                color: "var(--color-bone)",
                lineHeight: 1.2,
                marginBottom: "0.35rem",
              }}
            >
              Agent Health{" "}
              <em
                style={{ fontStyle: "italic", color: "var(--color-night-hi)" }}
              >
                Dashboard
              </em>
            </h2>
            <p
              style={{
                fontSize: "0.85rem",
                color: "rgba(235,220,200,0.38)",
                maxWidth: 480,
                lineHeight: 1.6,
              }}
            >
              Click any Degraded or Failing row → apply fixes → watch real-time
              recovery.
            </p>
          </div>

          {/* Live ticker */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1.3rem",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--color-pistachio)",
                animation: "blink 1.4s ease-in-out infinite",
              }}
            />
            <span
              className="font-mono uppercase text-night-mono"
              style={{ fontSize: "0.6rem", letterSpacing: "0.1em" }}
            >
              Monitoring active
            </span>
            <span
              className="font-mono text-night-mid"
              style={{ fontSize: "0.6rem", marginLeft: "auto" }}
            >
              {clock}
            </span>
          </div>

          {/* Summary strip */}
          <div
            style={{
              display: "flex",
              gap: "0.7rem",
              marginBottom: "1.4rem",
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "Healthy", val: okCount, color: "#4CAF50" },
              { label: "Degraded", val: warnCount, color: "#FFC107" },
              { label: "Failing", val: errCount, color: "#F44336" },
              {
                label: "Total",
                val: agents.length,
                color: "var(--color-night-hi)",
              },
              {
                label: "Avg Uptime",
                val: `${avgUptime}%`,
                color: "var(--color-pistachio)",
              },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  flex: 1,
                  minWidth: 100,
                  background: "var(--color-night-surf)",
                  border: "1px solid var(--color-night-bord)",
                  borderRadius: 4,
                  padding: "0.75rem 0.9rem",
                  textAlign: "center",
                }}
              >
                <div
                  className="font-mono"
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: s.color,
                    transition: "color 0.5s",
                  }}
                >
                  {s.val}
                </div>
                <div
                  style={{
                    fontSize: "0.6rem",
                    color: "var(--color-night-mono)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginTop: "0.18rem",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Header row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "10px 1.5fr 80px 75px 60px 60px 70px 90px",
              gap: "0.8rem",
              padding: "0.35rem 1rem 0.35rem 1.1rem",
              marginBottom: "0.25rem",
            }}
          >
            {[
              "",
              "Agent",
              "Latency",
              "Success",
              "Errors",
              "Req/min",
              "Uptime",
              "Status",
            ].map((h) => (
              <span
                key={h || "dot"}
                className="font-mono text-night-mono"
                style={{
                  fontSize: "0.54rem",
                  letterSpacing: "0.11em",
                  textTransform: "uppercase",
                  textAlign: h === "Agent" ? "left" : "right",
                }}
              >
                {h}
              </span>
            ))}
          </div>

          {/* Agent rows */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}
          >
            {agents.map((agent) => {
              const st = state[agent.id];
              const col = sCol(st.status);
              const isOpen = openId === agent.id;
              const canClick = !!agent.fixSteps;

              return (
                <div key={agent.id}>
                  <div
                    onClick={() =>
                      canClick && setOpenId(isOpen ? null : agent.id)
                    }
                    style={{
                      background: "var(--color-night-surf)",
                      border: "1px solid",
                      borderColor: isOpen ? col : "var(--color-night-bord)",
                      borderRadius: isOpen ? "4px 4px 0 0" : 4,
                      display: "grid",
                      gridTemplateColumns:
                        "10px 1.5fr 80px 75px 60px 60px 70px 90px",
                      alignItems: "center",
                      gap: "0.8rem",
                      padding: "0.78rem 1rem 0.78rem 1.1rem",
                      cursor: canClick ? "pointer" : "default",
                      transition: "border-color 0.25s, background 0.2s",
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        flexShrink: 0,
                        background: col,
                        boxShadow: `0 0 7px ${col}55`,
                        transition: "background 0.5s, box-shadow 0.5s",
                      }}
                    />
                    <div
                      className="font-mono"
                      style={{
                        fontSize: "0.67rem",
                        color: "var(--color-bone)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {agent.name}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        className="font-mono"
                        style={{
                          fontSize: "0.73rem",
                          fontWeight: 600,
                          color: lCol(st.lat),
                          transition: "color 0.5s",
                        }}
                      >
                        {st.lat === null ? "—" : `${st.lat}ms`}
                      </div>
                      <div
                        style={{
                          fontSize: "0.56rem",
                          color: "var(--color-night-mono)",
                          marginTop: "0.1rem",
                        }}
                      >
                        latency
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        className="font-mono"
                        style={{
                          fontSize: "0.73rem",
                          fontWeight: 600,
                          color: scCol(st.success),
                          transition: "color 0.5s",
                        }}
                      >
                        {st.success}%
                      </div>
                      <div
                        style={{
                          fontSize: "0.56rem",
                          color: "var(--color-night-mono)",
                          marginTop: "0.1rem",
                        }}
                      >
                        success
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        className="font-mono"
                        style={{
                          fontSize: "0.73rem",
                          fontWeight: 600,
                          color: eCol(st.errors),
                          transition: "color 0.5s",
                        }}
                      >
                        {st.errors}
                      </div>
                      <div
                        style={{
                          fontSize: "0.56rem",
                          color: "var(--color-night-mono)",
                          marginTop: "0.1rem",
                        }}
                      >
                        errors
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        className="font-mono"
                        style={{
                          fontSize: "0.73rem",
                          fontWeight: 600,
                          color: "var(--color-bone)",
                        }}
                      >
                        {agent.rpm}
                      </div>
                      <div
                        style={{
                          fontSize: "0.56rem",
                          color: "var(--color-night-mono)",
                          marginTop: "0.1rem",
                        }}
                      >
                        req/min
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        className="font-mono"
                        style={{
                          fontSize: "0.73rem",
                          fontWeight: 600,
                          color: uCol(st.uptime),
                          transition: "color 0.5s",
                        }}
                      >
                        {st.uptime}%
                      </div>
                      <div
                        style={{
                          fontSize: "0.56rem",
                          color: "var(--color-night-mono)",
                          marginTop: "0.1rem",
                        }}
                      >
                        uptime
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span
                        className="font-mono"
                        style={{
                          fontSize: "0.51rem",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          padding: "3px 7px",
                          borderRadius: 2,
                          background: `${col}20`,
                          color: col,
                          whiteSpace: "nowrap",
                          display: "inline-block",
                          transition: "background 0.5s, color 0.5s",
                        }}
                      >
                        {sLbl(st.status)}
                      </span>
                    </div>
                  </div>

                  {/* Fix panel */}
                  {isOpen && canClick && (
                    <div
                      style={{
                        border: "1px solid",
                        borderTop: "none",
                        borderColor: col,
                        borderRadius: "0 0 4px 4px",
                        padding: "1rem 1.2rem",
                        background: `${col}09`,
                        animation: "slideDown 0.22s ease",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.82rem",
                          color: "rgba(235,220,200,0.62)",
                          marginBottom: "0.85rem",
                          lineHeight: 1.55,
                        }}
                      >
                        ⚠ {agent.issue}
                      </p>
                      <ul
                        style={{
                          listStyle: "none",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.28rem",
                          marginBottom: "0.9rem",
                        }}
                      >
                        {agent.fixSteps!.map((step, i) => {
                          let color = "rgba(235,220,200,0.58)";
                          let prefix = "→";
                          let cls = "";
                          if (st.fixed || (st.fixing && i < st.step)) {
                            color = "var(--color-night-hi)";
                            prefix = "✓";
                            cls = "step-done";
                          } else if (st.fixing && i === st.step) {
                            color = "var(--color-bone)";
                            prefix = "⟳";
                            cls = "step-active";
                          }
                          return (
                            <li
                              key={i}
                              style={{
                                fontSize: "0.79rem",
                                color,
                                paddingLeft: "1rem",
                                position: "relative",
                                lineHeight: 1.5,
                                transition: "color 0.4s",
                              }}
                            >
                              <span
                                style={{
                                  position: "absolute",
                                  left: 0,
                                  color: "var(--color-pistachio)",
                                  display: "inline-block",
                                  animation:
                                    cls === "step-active"
                                      ? "spin 0.8s linear infinite"
                                      : undefined,
                                }}
                              >
                                {prefix}
                              </span>
                              {step}
                            </li>
                          );
                        })}
                      </ul>

                      {(st.fixing || st.fixed) && (
                        <div
                          style={{
                            background: "var(--color-night-bord)",
                            borderRadius: 2,
                            height: 3,
                            width: "100%",
                            margin: "0.65rem 0 0.9rem",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              background:
                                "linear-gradient(90deg, var(--color-emerald), var(--color-pistachio))",
                              borderRadius: 2,
                              width: `${st.fixed ? 100 : Math.round((st.step / agent.fixSteps!.length) * 100)}%`,
                              transition: "width 0.35s ease",
                            }}
                          />
                        </div>
                      )}

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                          flexWrap: "wrap",
                        }}
                      >
                        {st.fixed ? (
                          <div
                            style={{
                              background: "rgba(76,175,80,0.1)",
                              border: "1px solid rgba(76,175,80,0.3)",
                              borderRadius: 3,
                              padding: "0.6rem 1rem",
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.68rem",
                              color: "#4CAF50",
                              letterSpacing: "0.06em",
                              marginTop: "0.4rem",
                              animation: "fadeIn 0.5s ease",
                            }}
                          >
                            ✦ All fixes applied — agent recovered successfully
                          </div>
                        ) : st.fixing ? (
                          <>
                            <button
                              disabled
                              style={{
                                background: "var(--color-emerald)",
                                color: "white",
                                border: "none",
                                padding: "0.48rem 1.15rem",
                                fontSize: "0.7rem",
                                fontFamily: "var(--font-mono)",
                                letterSpacing: "0.09em",
                                textTransform: "uppercase",
                                borderRadius: 2,
                                opacity: 0.45,
                                cursor: "not-allowed",
                              }}
                            >
                              ⟳ Applying fixes…
                            </button>
                            <span
                              className="font-mono"
                              style={{
                                fontSize: "0.66rem",
                                color: "var(--color-night-hi)",
                              }}
                            >
                              Running step {st.step + 1} of{" "}
                              {agent.fixSteps!.length}…
                            </span>
                          </>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startFix(agent.id);
                            }}
                            style={{
                              background: "var(--color-emerald)",
                              color: "white",
                              border: "none",
                              padding: "0.48rem 1.15rem",
                              fontSize: "0.7rem",
                              fontFamily: "var(--font-mono)",
                              letterSpacing: "0.09em",
                              textTransform: "uppercase",
                              borderRadius: 2,
                              cursor: "pointer",
                              transition: "background 0.2s",
                            }}
                          >
                            ⚡ Apply All Fixes
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Behind the Demo */}
      <section
        style={{
          padding: "4rem 5vw",
          background: "var(--color-espresso)",
          borderTop: "1px solid rgba(235,220,200,0.05)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "start",
          }}
        >
          <ScrollReveal direction="left">
            <span
              className="font-mono uppercase text-night-mono"
              style={{
                fontSize: "0.58rem",
                letterSpacing: "0.14em",
                display: "block",
                marginBottom: "0.9rem",
              }}
            >
              Behind the Demo
            </span>
            <h2
              className="font-heading font-light"
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                color: "var(--color-bone)",
                lineHeight: 1.2,
                marginBottom: "0.85rem",
              }}
            >
              We monitor.
              <br />
              We fix.
              <br />
              <em style={{ fontStyle: "italic", color: "#E08080" }}>
                You focus.
              </em>
            </h2>
            <p
              style={{
                fontSize: "0.88rem",
                color: "rgba(235,220,200,0.52)",
                lineHeight: 1.75,
                marginBottom: "0.85rem",
              }}
            >
              The dashboard above reflects how we manage AI in production for
              real clients. Every metric is something we track around the clock;
              latency spikes, error surges, uptime drops.
            </p>
            <p
              style={{
                fontSize: "0.88rem",
                color: "rgba(235,220,200,0.52)",
                lineHeight: 1.75,
                marginBottom: "0.85rem",
              }}
            >
              When an agent degrades we see it first. When it fails we fix it.
              You receive a report, not a panic call at 2am.
            </p>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
                marginTop: "1.1rem",
              }}
            >
              {[
                "24/7 uptime monitoring across all deployed agents",
                "Automated alerts with root-cause analysis",
                "Fix recommendations pushed within minutes",
                "Monthly performance reports with optimisation notes",
                "Proactive prompt tuning before issues become incidents",
              ].map((item) => (
                <li
                  key={item}
                  style={{
                    fontSize: "0.86rem",
                    color: "rgba(235,220,200,0.7)",
                    paddingLeft: "1.2rem",
                    position: "relative",
                    lineHeight: 1.5,
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      color: "var(--color-pistachio)",
                      fontSize: "0.74rem",
                    }}
                  >
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.9rem",
              }}
            >
              {[
                {
                  quote:
                    "\u201cI don\u2019t need to worry if my AI breaks, they handle it.\u201d",
                  source: "What clients tell us after onboarding",
                  borderColor: "var(--color-pistachio)",
                },
                {
                  quote:
                    "\u201cAll numbers, agents and metrics shown here are illustrative. Your real dashboard reflects your actual systems, agents and usage patterns.\u201d",
                  source: "A note from us",
                  borderColor: "#E08080",
                },
                {
                  quote:
                    "\u201cThink of this as a window into what ongoing management looks like; not a quote or guarantee.\u201d",
                  source: "What this demo is",
                  borderColor: "var(--color-night-hi)",
                },
              ].map((q) => (
                <div
                  key={q.source}
                  style={{
                    background: "rgba(235,220,200,0.05)",
                    border: "1px solid rgba(235,220,200,0.07)",
                    borderLeft: `3px solid ${q.borderColor}`,
                    borderRadius: "0 4px 4px 0",
                    padding: "1.2rem 1.4rem",
                  }}
                >
                  <p
                    className="font-heading"
                    style={{
                      fontSize: "1.08rem",
                      fontStyle: "italic",
                      color: "var(--color-bone)",
                      lineHeight: 1.6,
                    }}
                  >
                    {q.quote}
                  </p>
                  <div
                    className="font-mono uppercase text-night-mono"
                    style={{
                      fontSize: "0.57rem",
                      letterSpacing: "0.1em",
                      marginTop: "0.65rem",
                    }}
                  >
                    — {q.source}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "4rem 5vw",
          background: "var(--color-night)",
          borderTop: "1px solid var(--color-night-bord)",
          textAlign: "center",
        }}
      >
        <h2
          className="font-heading font-light"
          style={{
            fontSize: "clamp(1.7rem, 4vw, 2.6rem)",
            color: "var(--color-bone)",
            marginBottom: "0.65rem",
          }}
        >
          Want a dashboard like this for your AI?
        </h2>
        <p
          style={{
            fontSize: "0.9rem",
            color: "rgba(235,220,200,0.42)",
            marginBottom: "1.7rem",
          }}
        >
          Tell us what you&apos;re building — we&apos;ll keep it running.
        </p>
        <Link
          href="/contact"
          style={{
            background: "var(--color-emerald)",
            color: "white",
            padding: "0.78rem 1.9rem",
            borderRadius: 2,
            fontSize: "0.82rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textDecoration: "none",
            fontWeight: 500,
            display: "inline-block",
            border: "2px solid var(--color-emerald)",
            transition: "all 0.2s",
            fontFamily: "var(--font-body)",
          }}
        >
          Start the Conversation
        </Link>
      </section>
    </div>
  );
}
