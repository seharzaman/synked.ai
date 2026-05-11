"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Zap,
  TrendingUp,
  Clock,
  Target,
  BarChart3,
  Layers,
  CheckCircle,
  ArrowLeft,
  Download,
  Share2,
} from "lucide-react";
import type { ReportData } from "../types";
import { SCORE_LABELS, type AuditScores } from "../types";

// ─── Animated Background Canvas ──────────────────────────────────────────────

function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = window.innerWidth;
    let height = document.documentElement.scrollHeight;

    canvas.width = width;
    canvas.height = height;

    // Floating orbs
    const orbs = Array.from({ length: 5 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 150 + Math.random() * 250,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      hue: Math.random() > 0.5 ? ("emerald" as const) : ("pistachio" as const),
      opacity: 0.03 + Math.random() * 0.04,
    }));

    // Grid particles
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 1 + Math.random() * 2,
      opacity: 0.1 + Math.random() * 0.3,
      speed: 0.1 + Math.random() * 0.3,
      angle: Math.random() * Math.PI * 2,
    }));

    function draw() {
      ctx!.clearRect(0, 0, width, height);

      // Draw orbs
      for (const orb of orbs) {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < -orb.radius) orb.x = width + orb.radius;
        if (orb.x > width + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius) orb.y = height + orb.radius;
        if (orb.y > height + orb.radius) orb.y = -orb.radius;

        const gradient = ctx!.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.radius,
        );

        if (orb.hue === "emerald") {
          gradient.addColorStop(0, `rgba(18, 88, 66, ${orb.opacity})`);
          gradient.addColorStop(0.5, `rgba(26, 122, 94, ${orb.opacity * 0.5})`);
        } else {
          gradient.addColorStop(0, `rgba(127, 140, 67, ${orb.opacity})`);
          gradient.addColorStop(
            0.5,
            `rgba(127, 140, 67, ${orb.opacity * 0.4})`,
          );
        }
        gradient.addColorStop(1, "transparent");

        ctx!.fillStyle = gradient;
        ctx!.beginPath();
        ctx!.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx!.fill();
      }

      // Draw particles
      for (const p of particles) {
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;
        p.angle += (Math.random() - 0.5) * 0.02;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx!.fillStyle = `rgba(168, 212, 188, ${p.opacity})`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fill();
      }

      animationId = requestAnimationFrame(draw);
    }

    draw();

    function handleResize() {
      width = window.innerWidth;
      height = document.documentElement.scrollHeight;
      canvas!.width = width;
      canvas!.height = height;
    }

    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AuditReportPage() {
  const router = useRouter();
  const [report, setReport] = useState<ReportData | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("synked_audit_report");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setReport(parsed.report);
        setCompanyName(parsed.companyName || "Your Business");
      } catch {
        router.push("/business-audit");
      }
    } else {
      router.push("/business-audit");
    }
    setMounted(true);
  }, [router]);

  if (!report) {
    return (
      <div className="flex h-screen items-center justify-center bg-night">
        <div className="animate-pulse text-bone/50 font-mono text-sm">
          Loading report...
        </div>
      </div>
    );
  }

  function getScoreColor(score: number) {
    if (score >= 75) return "text-pistachio";
    if (score >= 50) return "text-emerald-lt";
    if (score >= 25) return "text-yellow-400";
    return "text-red-400";
  }

  function getScoreRingColor(score: number) {
    if (score >= 75) return "stroke-pistachio";
    if (score >= 50) return "stroke-emerald-lt";
    if (score >= 25) return "stroke-yellow-400";
    return "stroke-red-400";
  }

  function getImpactBadge(impact: "high" | "medium" | "low") {
    if (impact === "high")
      return "bg-pistachio/15 text-pistachio border border-pistachio/30";
    if (impact === "medium")
      return "bg-emerald-lt/15 text-emerald-lt border border-emerald-lt/30";
    return "bg-bone/10 text-bone/60 border border-bone/20";
  }

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (report.overallScore / 100) * circumference;

  return (
    <div className="min-h-screen bg-night text-bone relative overflow-hidden">
      <BackgroundCanvas />

      {/* Gradient overlays */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-night via-night/80 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-night via-night/80 to-transparent" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-bone/8 bg-night/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <button
            onClick={() => router.push("/business-audit")}
            className="flex items-center gap-2 text-sm text-bone/50 hover:text-bone transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Audit
          </button>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="border-bone/20 text-bone/70 hover:bg-bone/10 hover:text-bone bg-transparent"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Export PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
              }}
              className="border-bone/20 text-bone/70 hover:bg-bone/10 hover:text-bone bg-transparent"
            >
              <Share2 className="h-3.5 w-3.5 mr-1.5" />
              Share
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 mx-auto max-w-5xl px-6 py-14">
        {/* Hero Title */}
        <div
          className={`mb-12 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <span className="inline-block font-mono text-[11px] tracking-[0.22em] uppercase text-pistachio mb-4">
            AI Readiness Report
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-bone mb-3 leading-tight">
            {companyName}
          </h1>
          <p className="text-sm text-bone/40 font-mono">
            Generated by Synked.ai •{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="space-y-10">
          {/* Score Card */}
          <section
            className={`rounded-2xl border border-bone/8 bg-night-surf/60 backdrop-blur-sm p-8 md:p-10 transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              {/* Score ring */}
              <div className="relative flex h-40 w-40 shrink-0 items-center justify-center">
                <svg className="h-40 w-40 -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-bone/10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className={`${getScoreRingColor(report.overallScore)} transition-all duration-[2000ms] ease-out`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className={`text-4xl font-bold font-mono ${getScoreColor(report.overallScore)}`}
                  >
                    {report.overallScore}
                  </span>
                  <span className="text-xs text-bone/30 font-mono mt-1">
                    / 100
                  </span>
                </div>
                {/* Glow behind score */}
                <div className="absolute inset-0 rounded-full bg-emerald/5 blur-xl" />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-lg font-semibold text-bone mb-3 tracking-wide">
                  AI Readiness Score
                </h2>
                <p className="text-sm text-bone/60 leading-relaxed max-w-lg">
                  {report.scoreRationale}
                </p>
              </div>
            </div>

            {/* Named Score Breakdown */}
            {report.scores && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8 pt-8 border-t border-bone/8">
                {(
                  Object.entries(report.scores) as [
                    keyof AuditScores,
                    { score: number; rationale: string },
                  ][]
                ).map(([key, val]) => {
                  const smallCircumference = 2 * Math.PI * 18;
                  const smallOffset =
                    smallCircumference - (val.score / 100) * smallCircumference;
                  return (
                    <div
                      key={key}
                      className="flex flex-col items-center text-center gap-2"
                    >
                      <div className="relative h-14 w-14 flex items-center justify-center">
                        <svg
                          className="h-14 w-14 -rotate-90"
                          viewBox="0 0 44 44"
                        >
                          <circle
                            cx="22"
                            cy="22"
                            r="18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="text-bone/10"
                          />
                          <circle
                            cx="22"
                            cy="22"
                            r="18"
                            fill="none"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray={smallCircumference}
                            strokeDashoffset={smallOffset}
                            className={`${getScoreRingColor(val.score)} transition-all duration-[1500ms] ease-out`}
                          />
                        </svg>
                        <span
                          className={`absolute text-sm font-bold font-mono ${getScoreColor(val.score)}`}
                        >
                          {val.score}
                        </span>
                      </div>
                      <p className="text-[10px] font-mono uppercase tracking-wider text-bone/50">
                        {SCORE_LABELS[key]}
                      </p>
                      <p className="text-[11px] text-bone/40 leading-tight line-clamp-2">
                        {val.rationale}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Summary */}
          {report.summary && (
            <section
              className={`rounded-2xl border border-bone/8 bg-night-surf/60 backdrop-blur-sm p-8 transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-pistachio mb-4">
                Executive Summary
              </h2>
              <p className="text-sm text-bone/70 leading-relaxed">
                {report.summary}
              </p>
            </section>
          )}

          {/* Opportunities */}
          <section
            className={`space-y-5 transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pistachio/15">
                <Zap className="h-4 w-4 text-pistachio" />
              </div>
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-bone/70">
                Top Automation Opportunities
              </h2>
            </div>
            <div className="grid gap-4">
              {report.opportunities.map((opp, i) => (
                <div
                  key={i}
                  className="group rounded-xl border border-bone/8 bg-night-surf/40 backdrop-blur-sm p-5 hover:border-pistachio/20 hover:bg-night-surf/70 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald/20 text-xs font-bold text-pistachio font-mono">
                        {i + 1}
                      </span>
                      <h3 className="text-sm font-semibold text-bone">
                        {opp.title}
                      </h3>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider font-mono ${getImpactBadge(opp.impact)}`}
                    >
                      {opp.impact}
                    </span>
                  </div>
                  <p className="text-sm text-bone/55 leading-relaxed mb-3">
                    {opp.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-bone/35 font-mono">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{opp.timeframe}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recommended Stack */}
          <section
            className={`space-y-5 transition-all duration-700 delay-[400ms] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald/15">
                <Layers className="h-4 w-4 text-emerald-lt" />
              </div>
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-bone/70">
                Recommended AI Stack
              </h2>
            </div>
            <div className="rounded-xl border border-bone/8 bg-night-surf/40 backdrop-blur-sm overflow-hidden">
              {report.recommendedStack.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 px-5 py-4 hover:bg-bone/[0.03] transition-colors ${i > 0 ? "border-t border-bone/6" : ""}`}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald/10 border border-emerald/20">
                    <Target className="h-4 w-4 text-pistachio" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-bone">
                      {item.tool}
                    </span>
                    <p className="text-xs text-bone/40 mt-0.5">
                      {item.purpose}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Roadmap */}
          <section
            className={`space-y-5 transition-all duration-700 delay-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pistachio/15">
                <TrendingUp className="h-4 w-4 text-pistachio" />
              </div>
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-bone/70">
                Implementation Roadmap
              </h2>
            </div>
            <div className="rounded-xl border border-bone/8 bg-night-surf/40 backdrop-blur-sm p-6 md:p-8">
              <div className="space-y-0">
                {report.roadmap.map((phase, i) => (
                  <div key={i} className="relative flex gap-5 pb-8 last:pb-0">
                    {/* Timeline connector */}
                    <div className="flex flex-col items-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald text-bone text-xs font-bold font-mono shadow-lg shadow-emerald/20">
                        {i + 1}
                      </div>
                      {i < report.roadmap.length - 1 && (
                        <div className="w-px flex-1 bg-gradient-to-b from-emerald/40 to-emerald/10 mt-2" />
                      )}
                    </div>
                    {/* Phase content */}
                    <div className="flex-1 pt-1.5">
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="text-[11px] font-mono text-pistachio/70 tracking-wider">
                          {phase.phase}
                        </span>
                        <h3 className="text-sm font-semibold text-bone">
                          {phase.title}
                        </h3>
                      </div>
                      <ul className="space-y-1.5">
                        {phase.milestones.map((m, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-2 text-sm text-bone/55"
                          >
                            <CheckCircle className="h-3.5 w-3.5 mt-0.5 text-emerald-lt/60 shrink-0" />
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ROI */}
          <section
            className={`space-y-5 transition-all duration-700 delay-[600ms] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald/15">
                <BarChart3 className="h-4 w-4 text-emerald-lt" />
              </div>
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-bone/70">
                Estimated ROI
              </h2>
            </div>
            <div className="rounded-xl border border-bone/8 bg-night-surf/40 backdrop-blur-sm overflow-hidden">
              {report.roi.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between px-5 py-4 hover:bg-bone/[0.03] transition-colors ${i > 0 ? "border-t border-bone/6" : ""}`}
                >
                  <span className="text-sm text-bone/55">{item.metric}</span>
                  <span className="text-sm font-semibold text-pistachio font-mono">
                    {item.projection}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section
            className={`rounded-2xl border border-pistachio/20 bg-emerald/8 backdrop-blur-sm p-8 md:p-10 text-center transition-all duration-700 delay-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            <h2 className="text-xl font-serif font-light text-bone mb-3">
              Ready to implement these recommendations?
            </h2>
            <p className="text-sm text-bone/50 mb-6 max-w-lg mx-auto leading-relaxed">
              Our team can help you build and deploy these AI solutions. Book a
              free consultation to discuss your roadmap.
            </p>
            <Button
              onClick={() => router.push("/contact")}
              className="bg-emerald text-bone hover:bg-emerald-lt border border-emerald-lt/30 shadow-lg shadow-emerald/20"
            >
              Book a Consultation
              <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
            </Button>
          </section>
        </div>
      </main>
    </div>
  );
}
