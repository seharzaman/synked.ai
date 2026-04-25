import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
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

interface Conn {
  from: number;
  to: number;
}

/* ═══════════════════════════════════════════════════════════════════════════ */

export function DemoBuilderPage() {
  const [placed, setPlaced] = useState<PlacedNode[]>([]);
  const [conns, setConns] = useState<Conn[]>([]);
  const [selNode, setSelNode] = useState<number | null>(null);
  const [isSynked, setIsSynked] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [synkOk, setSynkOk] = useState(false);
  const [metrics, setMetrics] = useState<{
    cost: number;
    lat: number;
    nodes: number;
    conns: number;
    optims: string[];
  } | null>(null);
  const [animVals, setAnimVals] = useState({ cost: 0, lat: 0, nodes: 0 });
  const [showPulse, setShowPulse] = useState(false);

  const boardRef = useRef<HTMLDivElement>(null);
  const dragIdx = useRef<number | null>(null);
  const dragOff = useRef({ x: 0, y: 0 });

  /* ── helpers ──────────────────────────────────────────────────────────── */
  const ctr = (idx: number) => ({
    x: placed[idx].x + 45,
    y: placed[idx].y + 32,
  });

  const markUnsynked = useCallback(() => {
    setIsSynked(false);
    setSynkOk(false);
    setMetrics(null);
    setAnimVals({ cost: 0, lat: 0, nodes: 0 });
  }, []);

  /* ── palette drag start ──────────────────────────────────────────────── */
  const onPaletteDragStart = useCallback(
    (e: React.DragEvent, comp: BuilderComponent) => {
      e.dataTransfer.setData("bid", comp.type);
    },
    [],
  );

  /* ── board drop handlers ─────────────────────────────────────────────── */
  const onBoardDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const onBoardDragLeave = useCallback(() => setDragOver(false), []);

  const onBoardDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (isSynked) return;
      const bid = e.dataTransfer.getData("bid");
      if (!bid) return;
      const r = boardRef.current!.getBoundingClientRect();
      const x = Math.max(4, e.clientX - r.left - 45);
      const y = Math.max(4, e.clientY - r.top - 32);
      setPlaced((prev) => [...prev, { bid, x, y }]);
      markUnsynked();
    },
    [isSynked, markUnsynked],
  );

  /* ── palette click (fallback for non-drag) ───────────────────────────── */
  const addNode = useCallback(
    (comp: BuilderComponent) => {
      if (isSynked) return;
      const board = boardRef.current;
      if (!board) return;
      const r = board.getBoundingClientRect();
      const cx = Math.round(r.width / 2 - 45 + (Math.random() - 0.5) * 80);
      const cy = Math.round(r.height / 2 - 32 + (Math.random() - 0.5) * 60);
      setPlaced((prev) => [
        ...prev,
        {
          bid: comp.type,
          x: Math.max(4, Math.min(r.width - 94, cx)),
          y: Math.max(4, Math.min(r.height - 68, cy)),
        },
      ]);
      markUnsynked();
    },
    [isSynked, markUnsynked],
  );

  /* ── node dragging on canvas ─────────────────────────────────────────── */
  const onNodeMouseDown = useCallback(
    (e: React.MouseEvent, idx: number) => {
      if (isSynked) return;
      e.stopPropagation();
      const el = (e.currentTarget as HTMLElement).getBoundingClientRect();
      dragOff.current = { x: e.clientX - el.left, y: e.clientY - el.top };
      dragIdx.current = idx;
    },
    [isSynked],
  );

  const onNodeTouchStart = useCallback(
    (e: React.TouchEvent, idx: number) => {
      if (isSynked) return;
      e.stopPropagation();
      const touch = e.touches[0];
      const el = (e.currentTarget as HTMLElement).getBoundingClientRect();
      dragOff.current = {
        x: touch.clientX - el.left,
        y: touch.clientY - el.top,
      };
      dragIdx.current = idx;
    },
    [isSynked],
  );

  useEffect(() => {
    const onMove = (clientX: number, clientY: number) => {
      if (dragIdx.current === null) return;
      const r = boardRef.current?.getBoundingClientRect();
      if (!r) return;
      const idx = dragIdx.current;
      const nx = Math.max(
        0,
        Math.min(r.width - 90, clientX - r.left - dragOff.current.x),
      );
      const ny = Math.max(
        0,
        Math.min(r.height - 64, clientY - r.top - dragOff.current.y),
      );
      setPlaced((prev) =>
        prev.map((n, i) => (i === idx ? { ...n, x: nx, y: ny } : n)),
      );
    };
    const onMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (dragIdx.current !== null) e.preventDefault();
      onMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onUp = () => {
      dragIdx.current = null;
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onUp);
    };
  }, []);

  /* ── click node to connect ───────────────────────────────────────────── */
  const clickNode = useCallback(
    (idx: number) => {
      if (isSynked) return;
      if (selNode === null) {
        setSelNode(idx);
        setShowToast(true);
      } else if (selNode === idx) {
        setSelNode(null);
        setShowToast(false);
      } else {
        const exists = conns.some(
          (c) =>
            (c.from === selNode && c.to === idx) ||
            (c.from === idx && c.to === selNode),
        );
        if (!exists) {
          setConns((prev) => [...prev, { from: selNode, to: idx }]);
        }
        setSelNode(null);
        setShowToast(false);
        markUnsynked();
      }
    },
    [selNode, conns, isSynked, markUnsynked],
  );

  /* ── remove node ─────────────────────────────────────────────────────── */
  const removeNode = useCallback(
    (idx: number) => {
      if (isSynked) return;
      setPlaced((prev) => prev.filter((_, i) => i !== idx));
      setConns((prev) =>
        prev
          .filter((c) => c.from !== idx && c.to !== idx)
          .map((c) => ({
            from: c.from > idx ? c.from - 1 : c.from,
            to: c.to > idx ? c.to - 1 : c.to,
          })),
      );
      setSelNode(null);
      setShowToast(false);
      markUnsynked();
    },
    [isSynked, markUnsynked],
  );

  /* ── SYNK ────────────────────────────────────────────────────────────── */
  const synk = useCallback(() => {
    if (placed.length < 2) return;
    setIsSynked(true);
    setSynkOk(true);

    // pulse
    setShowPulse(true);
    setTimeout(() => setShowPulse(false), 1200);

    // compute metrics
    const totalCost = placed.reduce((s, n) => {
      const bc = builderComponents.find((c) => c.type === n.bid);
      return s + (bc?.cost ?? 0);
    }, 0);
    const rawLat = placed.reduce((s, n) => {
      const bc = builderComponents.find((c) => c.type === n.bid);
      return s + (bc?.latency ?? 0);
    }, 0);
    const hasCache = placed.some((n) => n.bid === "cache");
    const hasRag = placed.some((n) => n.bid === "rag");
    const hasLLM = placed.some((n) => n.bid === "llm");
    const effLat = hasCache ? Math.round(rawLat * 0.62) : rawLat;
    const connRatio = conns.length / Math.max(placed.length - 1, 1);

    const optims: string[] = [];
    if (!hasCache && placed.length > 2)
      optims.push("Add a Cache layer to cut latency by ~38%");
    if (!hasRag && hasLLM)
      optims.push("Add a RAG System for context-aware, accurate responses");
    if (connRatio < 0.7)
      optims.push(
        `${placed.length - 1 - conns.length} node(s) unconnected — wire them for full orchestration`,
      );
    if (connRatio >= 1 && hasCache && hasRag)
      optims.push("Architecture looks clean — no critical gaps detected ✓");
    if (optims.length === 0)
      optims.push("All components connected and optimised ✓");

    setMetrics({
      cost: totalCost,
      lat: effLat,
      nodes: placed.length,
      conns: conns.length,
      optims,
    });

    // count-up animation
    const start = performance.now();
    const dur = 1200;
    const tick = () => {
      const t = Math.min((performance.now() - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setAnimVals({
        cost: totalCost * ease,
        lat: effLat * ease,
        nodes: Math.round(placed.length * ease),
      });
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [placed, conns]);

  /* ── RESET ───────────────────────────────────────────────────────────── */
  const reset = useCallback(() => {
    setPlaced([]);
    setConns([]);
    setSelNode(null);
    setShowToast(false);
    setIsSynked(false);
    setSynkOk(false);
    setMetrics(null);
    setAnimVals({ cost: 0, lat: 0, nodes: 0 });
    setDragOver(false);
  }, []);

  /* ═══════════════════════════════════════════════════════════════════════ */
  return (
    <div
      style={{
        background: "var(--color-night)",
        color: "var(--color-bone)",
        minHeight: "100vh",
      }}
    >
      <DisclaimerBanner>
        <strong style={{ color: "var(--color-emerald)" }}>
          Concept demo — not a real pricing tool.
        </strong>{" "}
        This builder illustrates how we design and connect your AI system. Cost
        estimates, latency figures and optimisation suggestions are simulated
        examples. Real system designs and pricing are scoped individually per
        client.
      </DisclaimerBanner>

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--color-night)", padding: "4.5rem 5vw 3rem" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 75% 50%, rgba(127,140,67,0.12) 0%, transparent 55%)",
          }}
        />
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          <span
            className="font-mono uppercase"
            style={{
              fontSize: "0.63rem",
              letterSpacing: "0.22em",
              color: "var(--color-pistachio)",
              display: "block",
              marginBottom: "0.9rem",
            }}
          >
            System Builder
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
            Build Your Agent
            <br />
            System{" "}
            <em style={{ fontStyle: "italic", color: "var(--color-night-hi)" }}>
              Live
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
            Drag components onto the canvas, connect them, then hit → Synk — and
            watch your architecture come alive with animated data flow, live
            metrics, and optimisation insights.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {[
              "LLM Orchestration",
              "Live Connections",
              "Animated Data Flow",
              "Live Cost & Latency",
            ].map((chip) => (
              <span
                key={chip}
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
                }}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPLAINER ── */}
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
              icon: Move,
              title: "Drag & connect",
              desc: "Drop AI components onto the canvas;LLM core, RAG system, API layers, caches. Click two nodes to wire them together and form your architecture.",
            },
            {
              icon: Zap,
              title: "Hit Synk — watch it live",
              desc: "Click Synk System and watch: animated data pulses travel your connections, nodes glow, and live cost & latency metrics count up in real time. The canvas becomes your system.",
            },
            {
              icon: TrendingUp,
              title: "What this means for you",
              desc: "You don't need to figure out what to build or how. We take your current tools and turn them into one clean integrated system; built, deployed and managed by us.",
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
                      width: 22,
                      height: 22,
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

      {/* ── BUILDER SECTION ── */}
      <section
        style={{ padding: "4rem 5vw 5rem", background: "var(--color-night)" }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: "2rem" }}>
            <span
              className="font-mono uppercase"
              style={{
                fontSize: "0.58rem",
                letterSpacing: "0.14em",
                color: "var(--color-night-mono)",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              Interactive Demo — Simulated Outputs
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
              Build Your Agent System{" "}
              <em
                style={{ fontStyle: "italic", color: "var(--color-night-hi)" }}
              >
                Live
              </em>
            </h2>
            <p
              style={{
                fontSize: "0.85rem",
                color: "rgba(235,220,200,0.38)",
                maxWidth: 520,
                lineHeight: 1.6,
              }}
            >
              Drag components from the panel → click two nodes to connect them →
              hit → Synk to see your architecture animated with live data flow
              and metrics.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "190px 1fr",
              gap: "1.2rem",
            }}
          >
            {/* ── PALETTE ── */}
            <div
              style={{
                background: "var(--color-night-surf)",
                border: "1px solid var(--color-night-bord)",
                borderRadius: 4,
                padding: "0.9rem",
              }}
            >
              <div
                className="font-mono uppercase"
                style={{
                  fontSize: "0.58rem",
                  letterSpacing: "0.16em",
                  color: "var(--color-night-mono)",
                  marginBottom: "0.7rem",
                  opacity: 0.7,
                }}
              >
                Components
              </div>
              {builderComponents.map((comp) => {
                const Icon = iconMap[comp.icon];
                return (
                  <div
                    key={comp.type}
                    draggable={!isSynked}
                    onDragStart={(e) => onPaletteDragStart(e, comp)}
                    onClick={() => addNode(comp)}
                    style={{
                      background: "var(--color-night)",
                      border: "1px solid rgba(235,220,200,0.07)",
                      borderLeft: `3px solid ${comp.color}`,
                      borderRadius: 3,
                      padding: "0.55rem 0.75rem",
                      marginBottom: "0.45rem",
                      cursor: isSynked ? "not-allowed" : "grab",
                      userSelect: "none",
                      transition: "background 0.15s, transform 0.15s",
                      opacity: isSynked ? 0.3 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!isSynked) {
                        (e.currentTarget as HTMLElement).style.background =
                          "rgba(235,220,200,0.05)";
                        (e.currentTarget as HTMLElement).style.transform =
                          "translateX(3px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "var(--color-night)";
                      (e.currentTarget as HTMLElement).style.transform = "none";
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: "0.73rem",
                        fontWeight: 500,
                        color: "var(--color-bone)",
                      }}
                    >
                      {Icon && (
                        <Icon
                          style={{ width: 13, height: 13, color: comp.color }}
                        />
                      )}
                      {comp.label}
                    </div>
                    <div
                      style={{
                        fontSize: "0.63rem",
                        color: "var(--color-night-mono)",
                        marginTop: "0.12rem",
                      }}
                    >
                      {comp.desc}
                    </div>
                  </div>
                );
              })}
              <div
                className="font-mono"
                style={{
                  marginTop: "0.6rem",
                  fontSize: "0.56rem",
                  color: "var(--color-night-mid)",
                  lineHeight: 1.9,
                  letterSpacing: "0.05em",
                }}
              >
                ↳ Drag to canvas
                <br />↳ Click nodes to connect
                <br />↳ Hit → Synk to animate
              </div>
            </div>

            {/* ── CANVAS ── */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <div
                ref={boardRef}
                onDragOver={onBoardDragOver}
                onDragLeave={onBoardDragLeave}
                onDrop={onBoardDrop}
                style={{
                  position: "relative",
                  height: 380,
                  background:
                    "radial-gradient(ellipse at 50% 50%, rgba(18,88,66,0.07) 0%, transparent 65%), var(--color-night-surf)",
                  border: isSynked
                    ? "1.5px solid var(--color-pistachio)"
                    : `1.5px dashed ${dragOver ? "var(--color-night-mid)" : "var(--color-night-bord)"}`,
                  borderRadius: 4,
                  overflow: "hidden",
                  transition: "border-color 0.4s, box-shadow 0.4s",
                  boxShadow: isSynked
                    ? "0 0 40px rgba(127,140,67,0.12), inset 0 0 60px rgba(18,88,66,0.08)"
                    : "none",
                  cursor: "default",
                }}
              >
                {/* Synk pulse overlay */}
                {showPulse && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      pointerEvents: "none",
                      zIndex: 10,
                      animation: "pulseFade 1.2s ease forwards",
                    }}
                  />
                )}

                {/* SVG connections */}
                <svg
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                    overflow: "visible",
                  }}
                >
                  {conns.map((conn, i) => {
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
                <div style={{ position: "absolute", inset: 0 }}>
                  {placed.map((node, idx) => {
                    const comp = builderComponents.find(
                      (c) => c.type === node.bid,
                    );
                    const Icon = comp ? iconMap[comp.icon] : null;
                    const color = comp?.color ?? "#125842";
                    const isSel = selNode === idx;

                    return (
                      <div
                        key={idx}
                        onMouseDown={(e) => {
                          if ((e.target as HTMLElement).closest(".nr-btn"))
                            return;
                          onNodeMouseDown(e, idx);
                        }}
                        onTouchStart={(e) => {
                          if ((e.target as HTMLElement).closest(".nr-btn"))
                            return;
                          onNodeTouchStart(e, idx);
                        }}
                        onClick={(e) => {
                          if ((e.target as HTMLElement).closest(".nr-btn"))
                            return;
                          clickNode(idx);
                        }}
                        style={{
                          position: "absolute",
                          width: 90,
                          height: 64,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 3,
                          borderRadius: 4,
                          border: "1.5px solid",
                          borderColor: isSynked
                            ? color
                            : isSel
                              ? color
                              : `${color}88`,
                          background: isSynked
                            ? `${color}18`
                            : "rgba(12,26,18,0.9)",
                          cursor: "pointer",
                          userSelect: "none",
                          left: node.x,
                          top: node.y,
                          transition:
                            "box-shadow 0.25s, border-color 0.4s, background 0.4s",
                          boxShadow: isSynked
                            ? "0 0 14px rgba(127,140,67,0.4)"
                            : isSel
                              ? "0 0 0 2.5px var(--color-pistachio)"
                              : "none",
                        }}
                      >
                        {Icon && (
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 20,
                              height: 20,
                              color: isSynked ? color : "rgba(168,212,188,0.7)",
                            }}
                          >
                            <Icon style={{ width: 18, height: 18 }} />
                          </span>
                        )}
                        <span
                          className="font-mono"
                          style={{
                            fontSize: "0.51rem",
                            letterSpacing: "0.08em",
                            color: "var(--color-bone)",
                            textAlign: "center",
                          }}
                        >
                          {comp?.label}
                        </span>
                        {!isSynked && (
                          <button
                            className="nr-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNode(idx);
                            }}
                            style={{
                              position: "absolute",
                              top: 3,
                              right: 5,
                              background: "none",
                              border: "none",
                              color: "var(--color-night-mid)",
                              fontSize: "0.72rem",
                              cursor: "pointer",
                              lineHeight: 1,
                              padding: 0,
                            }}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Board hint */}
                {placed.length === 0 && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      className="font-mono"
                      style={{
                        fontSize: "0.68rem",
                        color: "var(--color-night-mid)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      Drop components here
                    </span>
                  </div>
                )}

                {/* Connect toast */}
                {showToast && !isSynked && (
                  <div
                    className="font-mono"
                    style={{
                      position: "absolute",
                      bottom: 12,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "var(--color-night-mid)",
                      color: "var(--color-bone)",
                      fontSize: "0.62rem",
                      padding: "0.38rem 0.85rem",
                      borderRadius: 2,
                      letterSpacing: "0.05em",
                      pointerEvents: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Click another node to connect ↗
                  </div>
                )}
              </div>

              {/* Actions */}
              <div
                style={{
                  display: "flex",
                  gap: "0.8rem",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={synk}
                  disabled={placed.length < 2 || isSynked}
                  style={{
                    background: "var(--color-emerald)",
                    color: "white",
                    border: "2px solid var(--color-emerald)",
                    padding: "0.58rem 1.45rem",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.7rem",
                    letterSpacing: "0.11em",
                    textTransform: "uppercase",
                    borderRadius: 2,
                    cursor:
                      placed.length < 2 || isSynked ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                    opacity: placed.length < 2 || isSynked ? 0.32 : 1,
                  }}
                >
                  → Synk System
                </button>
                <button
                  onClick={reset}
                  style={{
                    background: "none",
                    border: "1px solid var(--color-night-bord)",
                    color: "var(--color-night-mono)",
                    padding: "0.48rem 0.95rem",
                    fontSize: "0.68rem",
                    fontFamily: "var(--font-mono)",
                    borderRadius: 2,
                    cursor: "pointer",
                    transition: "border-color 0.2s, color 0.2s",
                  }}
                >
                  Reset
                </button>
                {synkOk && (
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "0.68rem",
                      color: "var(--color-pistachio)",
                      letterSpacing: "0.07em",
                    }}
                  >
                    ✦ System synked
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── METRICS ── */}
          {metrics && (
            <div style={{ marginTop: "1.2rem" }}>
              <div
                className="font-mono uppercase"
                style={{
                  fontSize: "0.58rem",
                  letterSpacing: "0.14em",
                  color: "var(--color-night-mono)",
                  marginBottom: "0.8rem",
                }}
              >
                → Architecture metrics — animating…
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))",
                  gap: "0.75rem",
                }}
              >
                <MetricCard
                  label="Cost / Request"
                  value={`$${animVals.cost.toFixed(3)}`}
                  sub="Simulated estimate"
                />
                <MetricCard
                  label="Est. Latency"
                  value={`${Math.round(animVals.lat)}ms`}
                  sub="Optimised chain"
                />
                <MetricCard
                  label="Components"
                  value={String(animVals.nodes)}
                  sub={`${metrics.conns} connection${metrics.conns !== 1 ? "s" : ""}`}
                />
                <div
                  style={{
                    background: "var(--color-night-surf)",
                    border: "1px solid rgba(127,140,67,0.25)",
                    borderRadius: 4,
                    padding: "0.95rem 1.1rem",
                    animation: "fadeUp 0.4s ease both",
                  }}
                >
                  <div
                    className="font-mono uppercase"
                    style={{
                      fontSize: "0.56rem",
                      letterSpacing: "0.12em",
                      color: "var(--color-night-mono)",
                      marginBottom: "0.35rem",
                    }}
                  >
                    Optimisations
                  </div>
                  {metrics.optims.map((o, i) => (
                    <div
                      key={i}
                      style={{
                        fontSize: "0.77rem",
                        color: "rgba(235,220,200,0.65)",
                        paddingLeft: "0.9rem",
                        position: "relative",
                        marginBottom: "0.28rem",
                        lineHeight: 1.45,
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: 0,
                          color: "var(--color-pistachio)",
                          fontSize: "0.7rem",
                        }}
                      >
                        ↳
                      </span>
                      {o}
                    </div>
                  ))}
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "rgba(235,220,200,0.35)",
                      marginTop: "0.3rem",
                      lineHeight: 1.4,
                    }}
                  >
                    Ideas — not guarantees
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── BEHIND THE DEMO ── */}
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
              className="font-mono uppercase"
              style={{
                fontSize: "0.58rem",
                letterSpacing: "0.14em",
                color: "var(--color-night-mono)",
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
              We build it.
              <br />
              We connect it.
              <br />
              <em style={{ fontStyle: "italic", color: "#E08080" }}>
                You own it.
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
              The builder mirrors our actual process. We map your existing
              tools, identify gaps, and design a unified AI system; no
              guesswork, no generic templates.
            </p>
            <p
              style={{
                fontSize: "0.88rem",
                color: "rgba(235,220,200,0.52)",
                lineHeight: 1.75,
                marginBottom: "0.85rem",
              }}
            >
              Every component you place on that canvas represents real
              infrastructure we design, build and integrate. Here&apos;s how a
              real engagement looks:
            </p>
            <ol
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "0.9rem",
                marginTop: "1.1rem",
                counterReset: "steps",
                padding: 0,
              }}
            >
              {[
                "Discovery call — we map your tools, workflows and goals",
                "Architecture design — we propose a custom system (like this builder, but real)",
                "Build & deploy — we construct, test and go live",
                "Monitor & optimise — ongoing management via the dashboard",
              ].map((step, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: "0.87rem",
                    color: "rgba(235,220,200,0.7)",
                    paddingLeft: "2rem",
                    position: "relative",
                    lineHeight: 1.5,
                  }}
                >
                  <span
                    className="font-mono"
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "0.05rem",
                      width: "1.35rem",
                      height: "1.35rem",
                      background: "rgba(18,88,66,0.4)",
                      border: "1px solid var(--color-emerald)",
                      color: "var(--color-night-hi)",
                      fontSize: "0.6rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 2,
                    }}
                  >
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
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
                    "\u201cI don\u2019t need to figure this out, they will set everything up properly.\u201d",
                  source: "What clients tell us after onboarding",
                  borderColor: "var(--color-pistachio)",
                },
                {
                  quote:
                    "\u201cThe cost and latency estimates shown here are illustrative. Real pricing depends on your stack, usage volume and the components we actually build.\u201d",
                  source: "A note from us",
                  borderColor: "#E08080",
                },
                {
                  quote:
                    "\u201cThink of this builder as a sketch pad, a way to visualise what\u2019s possible before we design the real thing together.\u201d",
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
                    className="font-mono uppercase"
                    style={{
                      fontSize: "0.57rem",
                      letterSpacing: "0.1em",
                      color: "var(--color-night-mono)",
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

      {/* ── CTA ── */}
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
          Ready to build your real system?
        </h2>
        <p
          style={{
            fontSize: "0.9rem",
            color: "rgba(235,220,200,0.42)",
            marginBottom: "1.7rem",
          }}
        >
          Tell us what you&apos;re working with — we&apos;ll design the
          architecture and take it from there.
        </p>
        <Link
          to="/contact"
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

/* ── Metric Card ── */
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
    <div
      style={{
        background: "var(--color-night-surf)",
        border: "1px solid var(--color-night-bord)",
        borderRadius: 4,
        padding: "0.95rem 1.1rem",
        animation: "fadeUp 0.4s ease both",
      }}
    >
      <div
        className="font-mono uppercase"
        style={{
          fontSize: "0.56rem",
          letterSpacing: "0.12em",
          color: "var(--color-night-mono)",
          marginBottom: "0.35rem",
        }}
      >
        {label}
      </div>
      <div
        className="font-mono"
        style={{
          fontSize: "1.05rem",
          fontWeight: 700,
          color: "var(--color-pistachio)",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "0.7rem",
          color: "rgba(235,220,200,0.35)",
          marginTop: "0.22rem",
          lineHeight: 1.4,
        }}
      >
        {sub}
      </div>
    </div>
  );
}
