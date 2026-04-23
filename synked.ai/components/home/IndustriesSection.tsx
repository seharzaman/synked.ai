"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { SectionLabel } from "@/components/shared/SectionLabel";

const pills = [
  "E-commerce",
  "Healthcare",
  "Real Estate",
  "Education",
  "Startups & SMEs",
  "Agencies",
];

export function IndustriesSection() {
  const [active, setActive] = useState<Set<string>>(
    new Set(["Healthcare", "Education", "Agencies"]),
  );

  const toggle = (pill: string) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(pill)) next.delete(pill);
      else next.add(pill);
      return next;
    });
  };

  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <ScrollReveal>
          <SectionLabel>Who We Serve</SectionLabel>
          <h2 className="font-heading text-3xl md:text-4xl font-light text-espresso mt-3 mb-10">
            Built for businesses ready to{" "}
            <em className="text-emerald">scale.</em>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {pills.map((pill) => (
              <Badge
                key={pill}
                variant={active.has(pill) ? "default" : "outline"}
                className={`cursor-pointer text-sm px-5 py-2 transition-all duration-300 ${
                  active.has(pill)
                    ? "bg-emerald text-white hover:bg-emerald-lt"
                    : "bg-transparent text-espresso/70 border-espresso/15 hover:border-espresso/30"
                }`}
                onClick={() => toggle(pill)}
              >
                {pill}
              </Badge>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="text-muted-foreground">
            Ideal clients are businesses that want{" "}
            <strong className="text-foreground">results from AI</strong>, not
            just access to tools.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
