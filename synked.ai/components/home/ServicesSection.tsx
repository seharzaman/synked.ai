"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { SectionLabel } from "@/components/shared/SectionLabel";
import { serviceCards } from "@/data/services";
import { useTilt } from "@/hooks/useTilt";
import { useRef } from "react";

function ServiceCard({
  num,
  title,
  desc,
  href,
  delay,
}: {
  num: string;
  title: string;
  desc: string;
  href: string;
  delay: number;
}) {
  const { ref, onMouseMove, onMouseLeave } = useTilt();

  return (
    <ScrollReveal delay={delay}>
      <Card
        ref={ref as React.Ref<HTMLDivElement>}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="group relative border-border/50 bg-off-white hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer hover:translate-x-1.5"
      >
        {/* Left accent bar */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-emerald origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500" />
        <CardContent className="p-6">
          <span className="font-mono text-xs text-muted-foreground">{num}</span>
          <h3 className="font-heading text-xl font-semibold text-espresso mt-2 mb-3">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {desc}
          </p>
          <Link
            href={href}
            className="font-mono text-xs uppercase tracking-wider text-emerald hover:text-emerald-lt transition-colors"
          >
            Learn more →
          </Link>
        </CardContent>
      </Card>
    </ScrollReveal>
  );
}

export function ServicesSection() {
  const stickyRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto" id="whatwedo">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
        {/* Sticky left */}
        <div
          ref={stickyRef}
          className="lg:sticky"
          style={{ top: "calc(var(--nav-h) + 2rem)" }}
        >
          <ScrollReveal direction="left">
            <SectionLabel>What We Do</SectionLabel>
            <h2 className="font-heading text-3xl md:text-4xl font-light text-espresso mt-3 mb-4">
              End-to-end AI. Built. Managed.{" "}
              <em className="text-emerald">Optimized.</em>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We&apos;re not a tool. We&apos;re your long-term AI partner,
              engineering intelligent systems that grow with your business.
            </p>
          </ScrollReveal>
        </div>

        {/* Right - Cards */}
        <div className="space-y-4">
          {serviceCards.map((card, i) => (
            <ServiceCard key={card.num} {...card} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
