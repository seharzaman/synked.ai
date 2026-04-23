"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { SectionLabel } from "@/components/shared/SectionLabel";

const chaosItems = [
  "Slack",
  "CRM",
  "API",
  "Email",
  "Database",
  "Notion",
  "Sheets",
  "Zapier",
];

export function SyncSection() {
  const [synced, setSynced] = useState<string[]>([]);
  const [complete, setComplete] = useState(false);
  const arenaRef = useRef<HTMLDivElement>(null);

  const progress = Math.round((synced.length / chaosItems.length) * 100);

  const handleDrop = useCallback(
    (item: string) => {
      if (synced.includes(item)) return;
      const next = [...synced, item];
      setSynced(next);
      if (next.length === chaosItems.length) {
        setTimeout(() => setComplete(true), 400);
      }
    },
    [synced],
  );

  const reset = () => {
    setSynced([]);
    setComplete(false);
  };

  return (
    <section className="bg-espresso py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <SectionLabel className="text-bone/40">Chaos → Order</SectionLabel>
            <h2 className="font-heading text-3xl md:text-4xl font-light text-bone mt-3">
              Drag the chaos into <em className="text-pistachio">synk.</em>
            </h2>
            <p className="text-bone/50 mt-3 max-w-xl mx-auto">
              Your tools are everywhere. Drag them all into the Synked Core and
              watch your architecture click into place.
            </p>
          </div>
        </ScrollReveal>

        {!complete ? (
          <div
            ref={arenaRef}
            className="relative min-h-[400px] rounded-xl border border-bone/10 bg-bone/5 p-8"
          >
            {/* Chaos items */}
            <div className="flex flex-wrap gap-3 mb-12 justify-center">
              {chaosItems.map((item) => {
                const isSynced = synced.includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => handleDrop(item)}
                    disabled={isSynced}
                    className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer select-none ${
                      isSynced
                        ? "bg-pistachio/20 text-pistachio border border-pistachio/30 opacity-50"
                        : "bg-bone/10 text-bone/80 border border-bone/15 hover:bg-bone/20 hover:scale-105 active:scale-95"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            {/* Drop core */}
            <div className="flex flex-col items-center">
              <div
                className={`w-32 h-32 rounded-full border-2 border-dashed flex flex-col items-center justify-center transition-all duration-500 ${
                  synced.length > 0
                    ? "border-pistachio bg-pistachio/10 scale-105"
                    : "border-bone/20 bg-bone/5"
                }`}
              >
                <span className="font-mono text-[10px] uppercase tracking-wider text-bone/60">
                  SYNKED CORE
                </span>
                <span className="font-mono text-lg text-pistachio mt-1">
                  {synced.length}/{chaosItems.length}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-48 h-1.5 bg-bone/10 rounded-full mt-6 overflow-hidden">
                <div
                  className="h-full bg-pistachio rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-bone/30 text-xs mt-4 font-mono">
                Click items to connect them to the core
              </p>
            </div>
          </div>
        ) : (
          <div
            className="text-center py-16 rounded-xl border border-pistachio/30 bg-pistachio/5"
            style={{ animation: "fadeUp 0.6s ease both" }}
          >
            <p className="font-mono text-xs uppercase tracking-wider text-pistachio mb-2">
              ✦ System Synked
            </p>
            <h3 className="font-heading text-2xl text-bone mb-2">
              All services connected, monitored, and optimized.
            </h3>
            <div className="flex gap-3 justify-center mt-6">
              <Button asChild>
                <a href="/contact">Start the Conversation</a>
              </Button>
              <Button variant="ghost" onClick={reset} className="text-bone/60">
                Reset Demo
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
