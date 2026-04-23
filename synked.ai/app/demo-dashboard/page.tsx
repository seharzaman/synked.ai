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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DisclaimerBanner } from "@/components/shared/DisclaimerBanner";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { agents, type Agent } from "@/data/agents";

/* ---------- helpers ---------- */
const sCol = (s: string) =>
  s === "ok" ? "#4CAF50" : s === "degraded" ? "#FFC107" : "#F44336";
const sLbl = (s: string) =>
  s === "ok" ? "Healthy" : s === "degraded" ? "Degraded" : "Failing";
const lCol = (v: number) =>
  v < 600 ? "#4CAF50" : v < 1300 ? "#FFC107" : "#F44336";
const scCol = (v: number) =>
  v >= 97 ? "#4CAF50" : v >= 88 ? "#FFC107" : "#F44336";
const uCol = (v: number) =>
  v >= 99 ? "#4CAF50" : v >= 95 ? "#FFC107" : "#F44336";
const eCol = (v: number) =>
  v > 30 ? "#F44336" : v > 8 ? "#FFC107" : "#4CAF50";

interface AgentState {
  lat: number;
  success: number;
  errors: number;
  uptime: number;
  status: Agent["status"];
  fixing: boolean;
  fixed: boolean;
  step: number;
}

export default function DemoDashboardPage() {
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
  const fixTimers = useRef<Record<string, NodeJS.Timeout>>({});

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
              lat: a.lat + Math.round((Math.random() - 0.5) * 28),
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
          ? Math.round(agent.lat + (agent.fixed.lat - agent.lat) * p)
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
      <section className="bg-night py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_60%,rgba(18,88,66,0.2)_0%,transparent_55%)] pointer-events-none" />
        <div className="max-w-[1100px] mx-auto relative z-10">
          <span className="font-mono text-[0.63rem] tracking-[0.22em] uppercase text-pistachio block mb-3">
            Health Monitor
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light text-bone leading-[1.1] mb-4">
            Agent Health
            <br />
            <em className="text-night-hi italic">Dashboard</em>
          </h1>
          <p className="text-bone/50 max-w-[520px] leading-relaxed mb-5">
            Real-time visibility across every agent. Click a degraded or failing
            agent, hit Apply Fixes, and watch the metrics recover, step by step.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { icon: CircleDot, label: "Live Status" },
              { icon: ArrowRight, label: "Step-by-Step Recovery" },
              { icon: BarChart2, label: "Live Metric Updates" },
              { icon: ShieldCheck, label: "Incident Resolution" },
            ].map((chip) => {
              const Icon = chip.icon;
              return (
                <Badge
                  key={chip.label}
                  variant="outline"
                  className="bg-bone/5 border-night-bord text-night-mono text-[0.59rem] tracking-wider uppercase gap-1"
                >
                  <Icon className="size-3" /> {chip.label}
                </Badge>
              );
            })}
          </div>
        </div>
      </section>

      {/* Explainer */}
      <section className="bg-espresso py-12 px-6 border-b border-bone/5">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: Monitor,
              title: "What you're seeing",
              desc: "A live control panel for your deployed AI agents. Each row shows real-time health, latency, error rate and uptime.",
            },
            {
              icon: Wrench,
              title: "Click to fix — for real",
              desc: "Click any Degraded or Failing agent. Hit Apply Fixes and watch: each step runs, the progress bar fills, and metrics recover.",
            },
            {
              icon: TrendingUp,
              title: "What this means for you",
              desc: "You won't touch any of this. We watch it 24/7, catch issues, and push fixes. You get a report.",
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.title} className="bg-bone/5 border-bone/8">
                <CardContent className="p-5">
                  <Icon className="size-5 text-pistachio mb-3" />
                  <h4 className="font-heading text-lg text-bone mb-2">
                    {card.title}
                  </h4>
                  <p className="text-[0.83rem] text-bone/50 leading-relaxed">
                    {card.desc}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="py-16 px-6 bg-night">
        <div className="max-w-[1100px] mx-auto">
          <div className="mb-6">
            <span className="font-mono text-[0.58rem] tracking-[0.14em] uppercase text-night-mono block mb-2">
              Live Demo — Simulated Data
            </span>
            <h2 className="font-heading text-2xl md:text-3xl font-light text-bone mb-1">
              Agent Health <em className="text-night-hi italic">Dashboard</em>
            </h2>
            <p className="text-[0.85rem] text-bone/38 max-w-[480px]">
              Click any Degraded or Failing row → apply fixes → watch real-time
              recovery.
            </p>
          </div>

          {/* Live ticker */}
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1.5 h-1.5 rounded-full bg-pistachio animate-pulse" />
            <span className="font-mono text-[0.6rem] tracking-wider uppercase text-night-mono">
              Monitoring active
            </span>
            <span className="font-mono text-[0.6rem] text-night-mid ml-auto">
              {clock}
            </span>
          </div>

          {/* Summary strip */}
          <div className="flex gap-3 mb-5 flex-wrap">
            {[
              { label: "Healthy", val: okCount, color: "#4CAF50" },
              { label: "Degraded", val: warnCount, color: "#FFC107" },
              { label: "Failing", val: errCount, color: "#F44336" },
              { label: "Total", val: agents.length, color: "var(--night-hi)" },
              {
                label: "Avg Uptime",
                val: `${avgUptime}%`,
                color: "var(--pistachio)",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="flex-1 min-w-[100px] bg-night-surf border border-night-bord rounded p-3 text-center"
              >
                <div
                  className="font-mono text-xl font-bold"
                  style={{ color: s.color }}
                >
                  {s.val}
                </div>
                <div className="text-[0.6rem] text-night-mono uppercase tracking-wider mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Header row */}
          <div className="hidden sm:grid grid-cols-[10px_1.5fr_80px_75px_60px_60px_70px_90px] gap-3 px-4 mb-1">
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
                key={h}
                className={`font-mono text-[0.54rem] tracking-[0.11em] uppercase text-night-mono ${h === "Agent" ? "text-left" : "text-right"}`}
              >
                {h}
              </span>
            ))}
          </div>

          {/* Agent rows */}
          <div className="flex flex-col gap-1">
            {agents.map((agent) => {
              const st = state[agent.id];
              const col = sCol(st.status);
              const isOpen = openId === agent.id;
              const canClick = !!agent.fixSteps;

              return (
                <div key={agent.id}>
                  <div
                    className={`bg-night-surf border border-night-bord rounded grid grid-cols-[10px_1fr_auto] sm:grid-cols-[10px_1.5fr_80px_75px_60px_60px_70px_90px] items-center gap-3 px-4 py-3 transition-all duration-200 ${
                      canClick ? "cursor-pointer hover:border-night-mid" : ""
                    } ${isOpen ? "rounded-b-none" : ""}`}
                    style={{ borderColor: isOpen ? col : undefined }}
                    onClick={() =>
                      canClick && setOpenId(isOpen ? null : agent.id)
                    }
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: col, boxShadow: `0 0 7px ${col}55` }}
                    />
                    <div className="font-mono text-[0.67rem] text-bone truncate">
                      {agent.name}
                    </div>
                    <div className="hidden sm:block text-right">
                      <div
                        className="font-mono text-[0.73rem] font-semibold"
                        style={{ color: lCol(st.lat) }}
                      >
                        {st.lat}ms
                      </div>
                      <div className="text-[0.56rem] text-night-mono">
                        latency
                      </div>
                    </div>
                    <div className="hidden sm:block text-right">
                      <div
                        className="font-mono text-[0.73rem] font-semibold"
                        style={{ color: scCol(st.success) }}
                      >
                        {st.success}%
                      </div>
                      <div className="text-[0.56rem] text-night-mono">
                        success
                      </div>
                    </div>
                    <div className="hidden sm:block text-right">
                      <div
                        className="font-mono text-[0.73rem] font-semibold"
                        style={{ color: eCol(st.errors) }}
                      >
                        {st.errors}
                      </div>
                      <div className="text-[0.56rem] text-night-mono">
                        errors
                      </div>
                    </div>
                    <div className="hidden sm:block text-right">
                      <div className="font-mono text-[0.73rem] font-semibold text-bone">
                        {agent.rpm}
                      </div>
                      <div className="text-[0.56rem] text-night-mono">
                        req/min
                      </div>
                    </div>
                    <div className="hidden sm:block text-right">
                      <div
                        className="font-mono text-[0.73rem] font-semibold"
                        style={{ color: uCol(st.uptime) }}
                      >
                        {st.uptime}%
                      </div>
                      <div className="text-[0.56rem] text-night-mono">
                        uptime
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className="font-mono text-[0.51rem] tracking-wider uppercase px-2 py-1 rounded-sm inline-block"
                        style={{ background: `${col}20`, color: col }}
                      >
                        {sLbl(st.status)}
                      </span>
                    </div>
                  </div>

                  {/* Fix panel */}
                  {isOpen && canClick && (
                    <div
                      className="border border-t-0 rounded-b p-4"
                      style={{
                        borderColor: col,
                        background: `${col}09`,
                        animation: "fadeUp 0.22s ease",
                      }}
                    >
                      <p className="text-[0.82rem] text-bone/60 mb-3 leading-relaxed">
                        ⚠ {agent.issue}
                      </p>
                      <ul className="space-y-1 mb-3">
                        {agent.fixSteps!.map((step, i) => {
                          let cls = "text-bone/55";
                          let prefix = "→";
                          if (st.fixed || (st.fixing && i < st.step)) {
                            cls = "text-night-hi";
                            prefix = "✓";
                          } else if (st.fixing && i === st.step) {
                            cls = "text-bone";
                            prefix = "⟳";
                          }
                          return (
                            <li
                              key={i}
                              className={`text-[0.79rem] ${cls} pl-4 relative leading-relaxed`}
                            >
                              <span className="absolute left-0 text-pistachio text-[0.7rem]">
                                {prefix}
                              </span>
                              {step}
                            </li>
                          );
                        })}
                      </ul>

                      {(st.fixing || st.fixed) && (
                        <div className="h-[3px] bg-night-bord rounded-sm overflow-hidden mb-3">
                          <div
                            className="h-full bg-gradient-to-r from-emerald to-pistachio rounded-sm transition-all duration-350"
                            style={{
                              width: `${st.fixed ? 100 : Math.round((st.step / agent.fixSteps!.length) * 100)}%`,
                            }}
                          />
                        </div>
                      )}

                      {st.fixed ? (
                        <div
                          className="bg-[rgba(76,175,80,0.1)] border border-[rgba(76,175,80,0.3)] rounded px-4 py-2 font-mono text-[0.68rem] text-[#4CAF50] tracking-wider"
                          style={{ animation: "fadeIn 0.5s ease" }}
                        >
                          ✦ All fixes applied — agent recovered successfully
                        </div>
                      ) : st.fixing ? (
                        <div className="flex items-center gap-3 flex-wrap">
                          <Button
                            disabled
                            className="bg-emerald text-white font-mono text-[0.7rem] uppercase tracking-wider opacity-45"
                          >
                            ⟳ Applying fixes…
                          </Button>
                          <span className="font-mono text-[0.66rem] text-night-hi">
                            Running step {st.step + 1} of{" "}
                            {agent.fixSteps!.length}…
                          </span>
                        </div>
                      ) : (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            startFix(agent.id);
                          }}
                          className="bg-emerald hover:bg-[#1a7a5e] text-white font-mono text-[0.7rem] uppercase tracking-wider"
                        >
                          ⚡ Apply All Fixes
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Behind the Demo */}
      <section className="bg-espresso py-16 px-6 border-t border-bone/5">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <ScrollReveal direction="left">
            <span className="font-mono text-[0.58rem] tracking-[0.14em] uppercase text-night-mono block mb-3">
              Behind the Demo
            </span>
            <h2 className="font-heading text-2xl md:text-3xl font-light text-bone leading-snug mb-4">
              We monitor.
              <br />
              We fix.
              <br />
              <em className="text-[#E08080] italic">You focus.</em>
            </h2>
            <p className="text-[0.88rem] text-bone/50 leading-relaxed mb-3">
              The dashboard above reflects how we manage AI in production for
              real clients. Every metric is something we track around the clock
              — latency spikes, error surges, uptime drops.
            </p>
            <p className="text-[0.88rem] text-bone/50 leading-relaxed mb-4">
              When an agent degrades we see it first. When it fails we fix it.
              You receive a report, not a panic call at 2am.
            </p>
            <ul className="space-y-2">
              {[
                "24/7 uptime monitoring across all deployed agents",
                "Automated alerts with root-cause analysis",
                "Fix recommendations pushed within minutes",
                "Monthly performance reports with optimisation notes",
                "Proactive prompt tuning before issues become incidents",
              ].map((item) => (
                <li
                  key={item}
                  className="text-[0.86rem] text-bone/70 pl-5 relative leading-relaxed"
                >
                  <span className="absolute left-0 text-pistachio text-[0.74rem]">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="space-y-4">
              {[
                {
                  quote:
                    '"I don\'t need to worry if my AI breaks, they handle it."',
                  source: "What clients tell us after onboarding",
                  accent: "border-l-pistachio",
                },
                {
                  quote:
                    '"All numbers, agents and metrics shown here are illustrative. Your real dashboard reflects your actual systems."',
                  source: "A note from us",
                  accent: "border-l-[#E08080]",
                },
                {
                  quote:
                    '"Think of this as a window into what ongoing management looks like — not a quote or guarantee."',
                  source: "What this demo is",
                  accent: "border-l-night-hi",
                },
              ].map((q) => (
                <Card
                  key={q.source}
                  className={`bg-bone/5 border-bone/7 border-l-[3px] ${q.accent} rounded-l-none`}
                >
                  <CardContent className="p-5">
                    <p className="font-heading text-lg italic text-bone leading-relaxed">
                      {q.quote}
                    </p>
                    <span className="font-mono text-[0.57rem] tracking-wider uppercase text-night-mono mt-2 block">
                      — {q.source}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-night py-16 px-6 border-t border-night-bord text-center">
        <h2 className="font-heading text-2xl md:text-3xl font-light text-bone mb-3">
          Want a dashboard like this for your AI?
        </h2>
        <p className="text-bone/40 mb-6">
          Tell us what you&apos;re building — we&apos;ll keep it running.
        </p>
        <Button asChild>
          <Link href="/contact">Start the Conversation</Link>
        </Button>
      </section>
    </div>
  );
}
