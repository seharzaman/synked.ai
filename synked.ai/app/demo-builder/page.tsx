"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  Cpu,
  BookOpen,
  Plug,
  Database,
  Inbox,
  Search,
  Move,
  Zap,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DisclaimerBanner } from "@/components/shared/DisclaimerBanner";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import {
  builderComponents,
  type BuilderComponent,
} from "@/data/builder-components";

const iconMap: Record<
  string,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
> = {
  Cpu,
  BookOpen,
  Plug,
  Database,
  Inbox,
  Search,
};

interface PlacedNode {
  bid: string;
  x: number;
  y: number;
}

interface Connection {
  from: number;
  to: number;
}

export default function DemoBuilderPage() {
  const [placed, setPlaced] = useState<PlacedNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [isSynked, setIsSynked] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  const totalCost = placed.reduce((s, n) => {
    const bc = builderComponents.find((c) => c.type === n.bid);
    return s + (bc?.cost ?? 0);
  }, 0);

  const totalLatency = placed.reduce((s, n) => {
    const bc = builderComponents.find((c) => c.type === n.bid);
    return s + (bc?.latency ?? 0);
  }, 0);

  const addNode = useCallback(
    (comp: BuilderComponent) => {
      if (isSynked) return;
      const x = 60 + Math.random() * 200;
      const y = 40 + Math.random() * 200;
      setPlaced((prev) => [...prev, { bid: comp.type, x, y }]);
    },
    [isSynked],
  );

  const clickNode = useCallback(
    (idx: number) => {
      if (isSynked) return;
      if (selectedNode === null) {
        setSelectedNode(idx);
      } else if (selectedNode !== idx) {
        const exists = connections.some(
          (c) =>
            (c.from === selectedNode && c.to === idx) ||
            (c.from === idx && c.to === selectedNode),
        );
        if (!exists) {
          setConnections((prev) => [...prev, { from: selectedNode, to: idx }]);
        }
        setSelectedNode(null);
      } else {
        setSelectedNode(null);
      }
    },
    [selectedNode, connections, isSynked],
  );

  const removeNode = useCallback(
    (idx: number) => {
      if (isSynked) return;
      setPlaced((prev) => prev.filter((_, i) => i !== idx));
      setConnections((prev) =>
        prev
          .filter((c) => c.from !== idx && c.to !== idx)
          .map((c) => ({
            from: c.from > idx ? c.from - 1 : c.from,
            to: c.to > idx ? c.to - 1 : c.to,
          })),
      );
      setSelectedNode(null);
    },
    [isSynked],
  );

  const synk = () => {
    if (placed.length < 2 || connections.length < 1) return;
    setIsSynked(true);
  };

  const reset = () => {
    setPlaced([]);
    setConnections([]);
    setSelectedNode(null);
    setIsSynked(false);
  };

  const ctr = (idx: number) => ({
    x: placed[idx].x + 45,
    y: placed[idx].y + 32,
  });

  return (
    <div className="bg-night text-bone min-h-screen">
      <DisclaimerBanner>
        <strong className="text-emerald">
          Concept demo — not a real pricing tool.
        </strong>{" "}
        This builder illustrates how we design and connect your AI system. Cost
        estimates, latency figures and optimisation suggestions are simulated
        examples.
      </DisclaimerBanner>

      {/* Hero */}
      <section className="bg-night py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_50%,rgba(127,140,67,0.12)_0%,transparent_55%)] pointer-events-none" />
        <div className="max-w-[1100px] mx-auto relative z-10">
          <span className="font-mono text-[0.63rem] tracking-[0.22em] uppercase text-pistachio block mb-3">
            System Builder
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light text-bone leading-[1.1] mb-4">
            Build Your Agent
            <br />
            System <em className="text-night-hi italic">Live</em>
          </h1>
          <p className="text-bone/50 max-w-[520px] leading-relaxed mb-5">
            Drag components onto the canvas, connect them, then hit → Synk — and
            watch your architecture come alive with animated data flow, live
            metrics, and optimisation insights.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "LLM Orchestration",
              "Live Connections",
              "Animated Data Flow",
              "Live Cost & Latency",
            ].map((chip) => (
              <Badge
                key={chip}
                variant="outline"
                className="bg-bone/5 border-night-bord text-night-mono text-[0.59rem] tracking-wider uppercase"
              >
                {chip}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Explainer */}
      <section className="bg-espresso py-12 px-6 border-b border-bone/5">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: Move,
              title: "Drag & connect",
              desc: "Drop AI components onto the canvas — LLM core, RAG system, API layers, caches. Click two nodes to wire them together and form your architecture.",
            },
            {
              icon: Zap,
              title: "Hit Synk — watch it live",
              desc: "Click Synk System and watch animated data pulses, nodes glow, and live cost & latency metrics.",
            },
            {
              icon: TrendingUp,
              title: "What this means for you",
              desc: "You don't need to figure out what to build. We take your tools and turn them into one clean integrated system.",
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

      {/* Builder Section */}
      <section className="py-16 px-6 bg-night">
        <div className="max-w-[1100px] mx-auto">
          <div className="mb-8">
            <span className="font-mono text-[0.58rem] tracking-[0.14em] uppercase text-night-mono block mb-2">
              Interactive Demo — Simulated Outputs
            </span>
            <h2 className="font-heading text-2xl md:text-3xl font-light text-bone mb-1">
              Build Your Agent System{" "}
              <em className="text-night-hi italic">Live</em>
            </h2>
            <p className="text-[0.85rem] text-bone/38 max-w-[520px]">
              Click components from the panel → click two nodes to connect them
              → hit → Synk to animate.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[190px_1fr] gap-5">
            {/* Palette */}
            <div className="bg-night-surf border border-night-bord rounded p-3.5">
              <span className="font-mono text-[0.58rem] tracking-[0.16em] uppercase text-night-mono/70 block mb-3">
                Components
              </span>
              <div className="space-y-2">
                {builderComponents.map((comp) => {
                  const Icon = iconMap[comp.icon];
                  return (
                    <button
                      key={comp.type}
                      onClick={() => addNode(comp)}
                      disabled={isSynked}
                      className="w-full text-left bg-night border border-bone/7 rounded py-2 px-3 hover:bg-bone/5 hover:translate-x-[3px] transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{
                        borderLeftColor: comp.color,
                        borderLeftWidth: 3,
                      }}
                    >
                      <div className="flex items-center gap-1.5 text-bone text-[0.73rem] font-medium">
                        {Icon && (
                          <Icon
                            className="size-3.5"
                            style={{ color: comp.color }}
                          />
                        )}
                        {comp.label}
                      </div>
                      <div className="text-[0.63rem] text-night-mono mt-0.5">
                        {comp.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="font-mono text-[0.56rem] text-night-mid mt-3 leading-relaxed tracking-wider">
                ↳ Click to add to canvas
                <br />↳ Click nodes to connect
                <br />↳ Hit → Synk to animate
              </p>
            </div>

            {/* Canvas */}
            <div className="flex flex-col gap-3">
              <div
                ref={boardRef}
                className={`relative h-[380px] rounded overflow-hidden transition-all duration-400 ${
                  isSynked
                    ? "border-[1.5px] border-pistachio shadow-[0_0_40px_rgba(127,140,67,0.12),inset_0_0_60px_rgba(18,88,66,0.08)]"
                    : "border-[1.5px] border-dashed border-night-bord"
                }`}
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 50%, rgba(18,88,66,0.07) 0%, transparent 65%), var(--night-surf)",
                }}
              >
                {/* SVG connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                  {connections.map((conn, i) => {
                    if (!placed[conn.from] || !placed[conn.to]) return null;
                    const p1 = ctr(conn.from);
                    const p2 = ctr(conn.to);
                    const mx = (p1.x + p2.x) / 2;
                    const my = (p1.y + p2.y) / 2 - 22;
                    const d = `M${p1.x},${p1.y} Q${mx},${my} ${p2.x},${p2.y}`;
                    const nodeColor =
                      builderComponents.find(
                        (c) => c.type === placed[conn.from].bid,
                      )?.color ?? "#7F8C43";

                    return (
                      <g key={i}>
                        <path
                          d={d}
                          fill="none"
                          stroke={isSynked ? "#7F8C43" : "#3A6650"}
                          strokeWidth={isSynked ? 1.8 : 0.9}
                          strokeDasharray={isSynked ? undefined : "4 4"}
                        />
                        {isSynked && (
                          <>
                            <circle r="4" fill={nodeColor} opacity="0.9">
                              <animateMotion
                                dur={`${0.9 + i * 0.2}s`}
                                repeatCount="indefinite"
                                path={d}
                              />
                            </circle>
                            <circle r="7" fill={nodeColor} opacity="0.2">
                              <animateMotion
                                dur={`${0.9 + i * 0.2}s`}
                                repeatCount="indefinite"
                                path={d}
                              />
                            </circle>
                          </>
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* Nodes */}
                {placed.map((node, idx) => {
                  const comp = builderComponents.find(
                    (c) => c.type === node.bid,
                  );
                  const Icon = comp ? iconMap[comp.icon] : null;
                  return (
                    <div
                      key={idx}
                      className={`absolute w-[90px] h-16 flex flex-col items-center justify-center gap-[3px] rounded border-[1.5px] cursor-pointer select-none transition-all duration-300 ${
                        selectedNode === idx ? "ring-2 ring-pistachio" : ""
                      } ${isSynked ? "shadow-[0_0_14px_rgba(127,140,67,0.4)]" : ""}`}
                      style={{
                        left: node.x,
                        top: node.y,
                        borderColor: comp?.color ?? "#125842",
                        backgroundColor: `${comp?.color ?? "#125842"}15`,
                      }}
                      onClick={() => clickNode(idx)}
                    >
                      {Icon && (
                        <Icon
                          className="size-[18px]"
                          style={{ color: comp?.color }}
                        />
                      )}
                      <span className="font-mono text-[0.51rem] tracking-wider text-bone text-center">
                        {comp?.label}
                      </span>
                      {!isSynked && (
                        <button
                          className="absolute top-[3px] right-[5px] text-night-mid hover:text-bone text-xs leading-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNode(idx);
                          }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  );
                })}

                {/* Hint */}
                {placed.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="font-mono text-[0.68rem] text-night-mid tracking-wider">
                      Click components to add here
                    </span>
                  </div>
                )}

                {/* Connect toast */}
                {selectedNode !== null && !isSynked && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-night-mid text-bone font-mono text-[0.62rem] px-3 py-1.5 rounded-sm tracking-wider pointer-events-none whitespace-nowrap">
                    Click another node to connect ↗
                  </div>
                )}
              </div>

              <div className="flex gap-3 items-center flex-wrap">
                <Button
                  onClick={synk}
                  disabled={
                    placed.length < 2 || connections.length < 1 || isSynked
                  }
                  className="bg-emerald hover:bg-transparent hover:text-pistachio border-2 border-emerald hover:border-pistachio font-mono text-[0.7rem] tracking-widest uppercase disabled:opacity-30"
                >
                  → Synk System
                </Button>
                <Button
                  variant="outline"
                  onClick={reset}
                  className="border-night-bord text-night-mono hover:border-night-mid hover:text-bone font-mono text-[0.68rem]"
                >
                  Reset
                </Button>
                {isSynked && (
                  <span className="font-mono text-[0.68rem] text-pistachio tracking-wider">
                    ✦ System synked
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Metrics */}
          {isSynked && (
            <div className="mt-5">
              <span className="font-mono text-[0.58rem] tracking-[0.14em] uppercase text-night-mono block mb-3">
                Live System Metrics
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <MetricCard
                  label="Components"
                  value={String(placed.length)}
                  sub="Active nodes"
                />
                <MetricCard
                  label="Connections"
                  value={String(connections.length)}
                  sub="Data pathways"
                />
                <MetricCard
                  label="Est. Cost"
                  value={`$${totalCost.toFixed(4)}/req`}
                  sub="Combined node cost"
                />
                <MetricCard
                  label="Est. Latency"
                  value={`${totalLatency}ms`}
                  sub="Total pipeline"
                />
              </div>
              <div className="mt-3">
                <Card className="bg-night-surf border-pistachio/25">
                  <CardContent className="p-4 space-y-1">
                    {[
                      "↳ Add a Cache node before LLM to reduce repeat query cost by ~40%",
                      "↳ RAG + Embeddings together cut hallucination rate ~60%",
                      "↳ Queue layer enables async processing for high-volume pipelines",
                    ].map((tip) => (
                      <p
                        key={tip}
                        className="text-[0.77rem] text-bone/65 leading-relaxed"
                      >
                        {tip}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
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
              We build it.
              <br />
              We connect it.
              <br />
              <em className="text-[#E08080] italic">You own it.</em>
            </h2>
            <p className="text-[0.88rem] text-bone/50 leading-relaxed mb-3">
              The builder mirrors our actual process. We map your existing
              tools, identify gaps, and design a unified AI system — no
              guesswork, no generic templates.
            </p>
            <p className="text-[0.88rem] text-bone/50 leading-relaxed mb-4">
              Every component you place on that canvas represents real
              infrastructure we design, build and integrate. Here&apos;s how a
              real engagement looks:
            </p>
            <ol className="space-y-3 list-none">
              {[
                "Discovery call — we map your tools, workflows and goals",
                "Architecture design — we propose a custom system (like this builder, but real)",
                "Build & deploy — we construct, test and go live",
                "Monitor & optimise — ongoing management via the dashboard",
              ].map((step, i) => (
                <li
                  key={i}
                  className="text-[0.87rem] text-bone/70 pl-8 relative leading-relaxed"
                >
                  <span className="absolute left-0 top-0.5 w-5 h-5 bg-emerald/40 border border-emerald text-night-hi font-mono text-[0.6rem] flex items-center justify-center rounded-sm">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="space-y-4">
              {[
                {
                  quote:
                    '"I don\'t need to figure this out, they will set everything up properly."',
                  source: "What clients tell us after onboarding",
                  accent: "border-l-pistachio",
                },
                {
                  quote:
                    '"The cost and latency estimates shown here are illustrative. Real pricing depends on your stack, usage volume and the components we actually build."',
                  source: "A note from us",
                  accent: "border-l-[#E08080]",
                },
                {
                  quote:
                    '"Think of this builder as a sketch pad, a way to visualise what\'s possible before we design the real thing together."',
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
          Ready to build your real system?
        </h2>
        <p className="text-bone/40 mb-6">
          Tell us what you&apos;re working with — we&apos;ll design the
          architecture and take it from there.
        </p>
        <Button asChild>
          <Link href="/contact">Start the Conversation</Link>
        </Button>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <Card
      className="bg-night-surf border-night-bord"
      style={{ animation: "fadeUp 0.4s ease both" }}
    >
      <CardContent className="p-4">
        <span className="font-mono text-[0.56rem] tracking-[0.12em] uppercase text-night-mono block mb-1">
          {label}
        </span>
        <span className="font-mono text-lg font-bold text-pistachio">
          {value}
        </span>
        <span className="text-[0.7rem] text-bone/35 block mt-0.5">{sub}</span>
      </CardContent>
    </Card>
  );
}
