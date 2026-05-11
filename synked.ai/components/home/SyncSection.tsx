"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

/* ── Lucide SVG icons (inline, 14×14) ── */
const ICONS: Record<string, string> = {
  brain:
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.04-4.04A3 3 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.04-4.04A3 3 0 0 0 14.5 2Z"/></svg>',
  database:
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>',
  credit_card:
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>',
  server:
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>',
  message_square:
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  zap: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  search:
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
  link: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
};

interface ChaosItem {
  id: string;
  label: string;
  icon: string;
  color: string;
}

const ITEMS: ChaosItem[] = [
  { id: "gpt4", label: "GPT-4o", icon: "brain", color: "#7C5ABF" },
  { id: "pinecone", label: "Pinecone", icon: "database", color: "#2A8A7A" },
  { id: "stripe", label: "Stripe API", icon: "credit_card", color: "#6358C8" },
  { id: "pg", label: "Postgres", icon: "server", color: "#4A6B99" },
  { id: "slack", label: "Slack", icon: "message_square", color: "#7A4A7B" },
  { id: "redis", label: "Redis", icon: "zap", color: "#B83A35" },
  { id: "openai", label: "Embeddings", icon: "search", color: "#2A8A5A" },
  { id: "webhook", label: "Webhooks", icon: "link", color: "#C08A30" },
];

const CPOS = [
  { x: "8%", y: "10%" },
  { x: "73%", y: "7%" },
  { x: "3%", y: "50%" },
  { x: "79%", y: "44%" },
  { x: "9%", y: "78%" },
  { x: "76%", y: "72%" },
  { x: "37%", y: "5%" },
  { x: "39%", y: "82%" },
];

export function SyncSection() {
  const [dropped, setDropped] = useState<string[]>([]);
  const [synced, setSynced] = useState(false);
  const arenaRef = useRef<HTMLDivElement>(null);

  const remaining = ITEMS.filter((i) => !dropped.includes(i.id));
  const synkedItems = ITEMS.filter((i) => dropped.includes(i.id));

  const handleDrop = useCallback(
    (id: string) => {
      if (dropped.includes(id)) return;
      const next = [...dropped, id];
      setDropped(next);
      if (next.length === ITEMS.length) {
        setTimeout(() => setSynced(true), 400);
      }
    },
    [dropped],
  );

  const reset = () => {
    setDropped([]);
    setSynced(false);
  };

  /* ── Desktop drag handlers ── */
  const onDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("cid", id);
  };
  const onDragOver = (e: React.DragEvent) => e.preventDefault();
  const onDropCore = (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("cid");
    if (id) handleDrop(id);
  };

  /* ── Touch drag state ── */
  const touchRef = useRef<{
    el: HTMLElement;
    id: string;
    startX: number;
    startY: number;
    origLeft: string;
    origTop: string;
  } | null>(null);

  const onTouchStart = (e: React.TouchEvent, id: string) => {
    e.preventDefault();
    const el = e.currentTarget as HTMLElement;
    const touch = e.touches[0];
    el.style.animation = "none";
    el.style.opacity = "0.9";
    el.style.zIndex = "20";
    touchRef.current = {
      el,
      id,
      startX: touch.clientX,
      startY: touch.clientY,
      origLeft: el.style.left,
      origTop: el.style.top,
    };
  };

  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!touchRef.current) return;
    const touch = e.touches[0];
    const { el, startX, startY } = touchRef.current;
    const origLeft = parseFloat(touchRef.current.origLeft) || 0;
    const origTop = parseFloat(touchRef.current.origTop) || 0;
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    el.style.left = origLeft + dx + "px";
    el.style.top = origTop + dy + "px";
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!touchRef.current) return;
    const { el, id } = touchRef.current;
    el.style.opacity = "";
    el.style.zIndex = "";
    const touch = e.changedTouches[0];
    const core = arenaRef.current?.querySelector("[data-drop-core]");
    if (core) {
      const cr = core.getBoundingClientRect();
      if (
        touch.clientX >= cr.left &&
        touch.clientX <= cr.right &&
        touch.clientY >= cr.top &&
        touch.clientY <= cr.bottom
      ) {
        handleDrop(id);
        touchRef.current = null;
        return;
      }
    }
    // Reset position
    el.style.left = touchRef.current.origLeft;
    el.style.top = touchRef.current.origTop;
    el.style.animation = "";
    touchRef.current = null;
  };

  /* ── SVG connection lines ── */
  const [arenaDims, setArenaDims] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = arenaRef.current;
    if (!el) return;
    const update = () =>
      setArenaDims({ w: el.offsetWidth, h: el.offsetHeight });
    update();
    const obs = new ResizeObserver(update);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const cx = arenaDims.w / 2;
  const cy = arenaDims.h / 2;

  return (
    <section
      style={{
        padding: "7rem 3rem",
        background: "var(--color-espresso)",
        borderTop: "1px solid rgba(235,220,200,.06)",
      }}
    >
      {/* keyframes */}
      <style>{`
        @keyframes syncFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes snapIn{0%{transform:scale(1.15) rotate(3deg);opacity:.7}60%{transform:scale(.96) rotate(-1deg)}100%{transform:scale(1) rotate(0);opacity:1}}
      `}</style>

      <div
        style={{
          width: 700,
          maxWidth: "100%",
          margin: "0 auto",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Header */}
        <ScrollReveal>
          <div
            style={{ textAlign: "center", marginBottom: "3rem", width: "100%" }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase" as const,
                color: "var(--color-pistachio)",
              }}
            >
              Chaos → Order
            </span>
            <h2
              className="font-heading"
              style={{
                fontSize: "clamp(2.4rem,4vw,3.6rem)",
                fontWeight: 300,
                color: "var(--color-bone)",
                marginBottom: "1rem",
                marginTop: "0.6rem",
              }}
            >
              Drag the{" "}
              <span style={{ fontStyle: "italic", color: "#E08080" }}>
                chaos
              </span>{" "}
              into{" "}
              <span
                style={{ fontStyle: "italic", color: "var(--color-pistachio)" }}
              >
                synk.
              </span>
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: "rgba(235,220,200,.5)",
                maxWidth: 480,
                margin: "0 auto",
              }}
            >
              Your tools are everywhere. Drag them all into the Synked Core and
              watch your architecture click into place.
            </p>
          </div>
        </ScrollReveal>

        {/* Arena */}
        <div
          ref={arenaRef}
          style={{ position: "relative", height: 440, width: "100%" }}
        >
          {!synced && (
            <>
              {/* Floating chaos items */}
              {remaining.map((item) => {
                const pos = CPOS[ITEMS.indexOf(item)];
                const idx = ITEMS.indexOf(item);
                return (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, item.id)}
                    onTouchStart={(e) => onTouchStart(e, item.id)}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    style={{
                      position: "absolute",
                      left: pos.x,
                      top: pos.y,
                      borderRadius: 6,
                      padding: "0.62rem 0.88rem",
                      cursor: "grab",
                      userSelect: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.45rem",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: "var(--color-bone)",
                      whiteSpace: "nowrap",
                      background: item.color + "22",
                      border: `1.5px solid ${item.color}88`,
                      animation: `syncFloat ${2.5 + idx * 0.4}s ease-in-out infinite`,
                      animationDelay: `${idx * 0.3}s`,
                      transition: "opacity 0.3s",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: item.color,
                      }}
                      dangerouslySetInnerHTML={{
                        __html: ICONS[item.icon] || "",
                      }}
                    />
                    {item.label}
                  </div>
                );
              })}
            </>
          )}

          {/* Synced items orbiting */}
          {synkedItems.map((item, i) => {
            const ang = (i / ITEMS.length) * Math.PI * 2 - Math.PI / 2;
            const r = 128;
            const x = cx + Math.cos(ang) * r - 38;
            const y = cy + Math.sin(ang) * r - 16;
            return (
              <div
                key={item.id}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  borderRadius: 5,
                  padding: "0.38rem 0.65rem",
                  fontSize: "0.73rem",
                  fontWeight: 600,
                  color: "var(--color-bone)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.38rem",
                  whiteSpace: "nowrap",
                  zIndex: 5,
                  background: item.color + "22",
                  border: `1.5px solid ${item.color}`,
                  boxShadow: `0 0 10px ${item.color}44`,
                  animation: "snapIn .5s cubic-bezier(.34,1.56,.64,1)",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: item.color,
                  }}
                  dangerouslySetInnerHTML={{ __html: ICONS[item.icon] || "" }}
                />
                {item.label}
              </div>
            );
          })}

          {/* SVG connection lines */}
          {synkedItems.length > 0 && arenaDims.w > 0 && (
            <svg
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 4,
              }}
              viewBox={`0 0 ${arenaDims.w} ${arenaDims.h}`}
            >
              {synkedItems.map((item, i) => {
                const ang = (i / ITEMS.length) * Math.PI * 2 - Math.PI / 2;
                const r = 120;
                const x1 = cx + Math.cos(ang) * r;
                const y1 = cy + Math.sin(ang) * r;
                return (
                  <line
                    key={item.id}
                    x1={x1}
                    y1={y1}
                    x2={cx}
                    y2={cy}
                    stroke={item.color}
                    strokeWidth={1}
                    opacity={0.4}
                    strokeDasharray="4 4"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      values="8;0"
                      dur="0.8s"
                      repeatCount="indefinite"
                    />
                  </line>
                );
              })}
            </svg>
          )}

          {/* Drop core */}
          <div
            data-drop-core
            onDragOver={onDragOver}
            onDrop={onDropCore}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%,-50%)",
              width: 185,
              height: 185,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "0.45rem",
              transition: "all .4s",
              zIndex: 10,
              background: synced
                ? "radial-gradient(circle,rgba(127,140,67,.22) 0%,transparent 70%)"
                : dropped.length > 0
                  ? "radial-gradient(circle,rgba(127,140,67,.22) 0%,transparent 70%)"
                  : "radial-gradient(circle,rgba(18,88,66,.08) 0%,transparent 70%)",
              border: `2px solid ${
                synced || dropped.length > 0
                  ? "#7F8C43"
                  : "rgba(235,220,200,.1)"
              }`,
              boxShadow:
                synced || dropped.length > 0
                  ? "0 0 55px rgba(127,140,67,.28)"
                  : "none",
            }}
          >
            <div
              style={{
                fontSize: "1.7rem",
                color:
                  synced || dropped.length > 0
                    ? "#7F8C43"
                    : "rgba(235,220,200,.3)",
              }}
            >
              {synced ? "✓" : "⊕"}
            </div>
            <div
              className="font-mono"
              style={{
                fontSize: "0.58rem",
                letterSpacing: "0.11em",
                textAlign: "center",
                color:
                  synced || dropped.length > 0
                    ? "#7F8C43"
                    : "rgba(235,220,200,.3)",
              }}
            >
              {synced
                ? "SYNKED CORE"
                : dropped.length > 0
                  ? `${dropped.length}/${ITEMS.length} synced`
                  : "DROP ZONE"}
            </div>
            {dropped.length > 0 && !synced && (
              <div
                style={{
                  width: 76,
                  height: 3,
                  background: "rgba(235,220,200,.1)",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background: "var(--color-pistachio)",
                    transition: "width .4s",
                    width: `${(dropped.length / ITEMS.length) * 100}%`,
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Hint */}
        {!synced && dropped.length === 0 && (
          <p
            className="font-mono"
            style={{
              textAlign: "center",
              marginTop: "1rem",
              fontSize: "0.62rem",
              color: "rgba(235,220,200,.22)",
              letterSpacing: "0.1em",
            }}
          >
            Drag all floating blocks into the central drop zone
          </p>
        )}

        {/* Success */}
        {synced && (
          <div
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              paddingTop: "1.5rem",
            }}
          >
            <div
              className="font-heading"
              style={{
                fontSize: "2.2rem",
                fontStyle: "italic",
                fontWeight: 300,
                color: "var(--color-pistachio)",
                marginBottom: "0.8rem",
              }}
            >
              ✦ System Synked
            </div>
            <p
              style={{
                fontSize: "0.95rem",
                color: "rgba(235,220,200,.5)",
                marginBottom: "1.5rem",
              }}
            >
              All services connected, monitored, and optimized.
            </p>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Link
                href="/contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.85rem 2.2rem",
                  background: "var(--color-pistachio)",
                  color: "var(--color-espresso)",
                  borderRadius: 2,
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase" as const,
                  textDecoration: "none",
                  fontWeight: 600,
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
              >
                Start the Conversation
              </Link>
              <button
                onClick={reset}
                style={{
                  padding: "0.85rem 2.2rem",
                  background: "transparent",
                  color: "rgba(235,220,200,.5)",
                  border: "1px solid rgba(235,220,200,.15)",
                  borderRadius: 2,
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase" as const,
                  cursor: "pointer",
                  transition: "border-color 0.2s, color 0.2s",
                }}
              >
                Reset Demo
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
