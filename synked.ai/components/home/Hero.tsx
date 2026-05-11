"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroCanvas } from "./HeroCanvas";
import { useTypingAnimation } from "@/hooks/useTypingAnimation";
import { useCursorGlow } from "@/hooks/useCursorGlow";

// Seeded pseudo-random so server and client produce identical values
function seededRandom(seed: number) {
  return () => {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

export function Hero() {
  const eyebrow = useTypingAnimation("AI Agent Automation Studio", 45, 900);
  useCursorGlow();

  const particles = useMemo(() => {
    const rng = seededRandom(42);
    return Array.from({ length: 18 }).map((_, i) => ({
      size: 2 + rng() * 4,
      left: rng() * 100,
      dur: 6 + rng() * 8,
      delay: rng() * 8,
      even: i % 2 === 0,
    }));
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ padding: "var(--nav-h) 5vw 6rem" }}
    >
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-off-white">
        <HeroCanvas />
        <div
          className="absolute top-[-10%] right-[-5%] w-[45vw] h-[45vw] opacity-55 blur-[40px] pointer-events-none animate-[morphBlob_12s_ease-in-out_infinite]"
          style={{
            background:
              "radial-gradient(ellipse, #c8d5bc 0%, #d8e5cc 40%, transparent 70%)",
            willChange: "transform, border-radius",
          }}
        />
        <div
          className="absolute bottom-[-5%] left-[-5%] w-[35vw] h-[35vw] opacity-55 blur-[40px] pointer-events-none animate-[morphBlob_12s_ease-in-out_infinite_-4s]"
          style={{
            background:
              "radial-gradient(ellipse, #ddd5c0 0%, #e8e0d0 40%, transparent 70%)",
            willChange: "transform, border-radius",
          }}
        />
        <div
          className="absolute top-[40%] left-[30%] w-[25vw] h-[25vw] opacity-25 blur-[40px] pointer-events-none animate-[morphBlob_12s_ease-in-out_infinite_-8s]"
          style={{
            background: "radial-gradient(ellipse, #b8c8a8 0%, transparent 70%)",
            willChange: "transform, border-radius",
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.left}%`,
              bottom: "-10px",
              background: p.even
                ? "rgba(18,88,66,0.18)"
                : "rgba(127,140,67,0.2)",
              animation: `floatUp ${p.dur}s linear infinite`,
              animationDelay: `${p.delay}s`,
              willChange: "transform",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[700px]">
        <span
          className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-pistachio block mb-6"
          style={{
            opacity: 0,
            animation: "fadeUp 0.8s cubic-bezier(.16,1,.3,1) 0.3s forwards",
          }}
        >
          {eyebrow}
          <span className="inline-block w-[2px] h-4 bg-emerald ml-1 animate-pulse align-middle" />
        </span>

        <h1
          className="font-heading font-light text-espresso leading-[1] tracking-[-0.01em] mb-6"
          style={{ fontSize: "clamp(4rem, 8vw, 8rem)" }}
        >
          <span
            className="block"
            style={{
              opacity: 0,
              transform: "translateY(30px)",
              animation: "fadeUp 0.9s cubic-bezier(.16,1,.3,1) 0.5s forwards",
            }}
          >
            Your AI.
          </span>
          <span
            className="block italic text-emerald"
            style={{
              opacity: 0,
              transform: "translateY(30px)",
              animation: "fadeUp 0.9s cubic-bezier(.16,1,.3,1) 0.65s forwards",
            }}
          >
            Perfectly
          </span>
          <span
            className="block"
            style={{
              opacity: 0,
              transform: "translateY(30px)",
              animation: "fadeUp 0.9s cubic-bezier(.16,1,.3,1) 0.8s forwards",
            }}
          >
            Synked.
          </span>
        </h1>

        <p
          className="text-[1.05rem] leading-[1.75] text-espresso/70 max-w-[520px] mb-10"
          style={{
            opacity: 0,
            animation: "fadeUp 0.8s cubic-bezier(.16,1,.3,1) 1s forwards",
          }}
        >
          <span className="font-heading italic font-normal text-emerald text-[1.1rem]">
            Synked.ai
          </span>{" "}
          — We design, deploy, and continuously manage intelligent AI agents
          that automate workflows, handle customer interactions, and integrate
          seamlessly into your existing systems.
        </p>

        <div
          className="flex items-center gap-5 flex-wrap"
          style={{
            opacity: 0,
            animation: "fadeUp 0.8s cubic-bezier(.16,1,.3,1) 1.15s forwards",
          }}
        >
          <Button asChild size="lg">
            <Link href="/services">Explore Services</Link>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link href="/about">Our Story →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
