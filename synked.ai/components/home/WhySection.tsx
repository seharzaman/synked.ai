"use client";

import { Code2, Link as LinkIcon, Handshake, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { SectionLabel } from "@/components/shared/SectionLabel";
import { useTilt } from "@/hooks/useTilt";

const items = [
  {
    icon: Code2,
    title: "Engineering-Level AI",
    desc: "Custom LLM integrations, RAG pipelines, vector databases — not just ChatGPT wrappers.",
  },
  {
    icon: LinkIcon,
    title: "Deep Integration",
    desc: "We build AI into your actual systems — not alongside them.",
  },
  {
    icon: Handshake,
    title: "Long-Term Partnership",
    desc: "We manage and continuously optimize your AI — not just hand it off after launch.",
  },
  {
    icon: TrendingUp,
    title: "Real ROI",
    desc: "One unified managed system replaces tool chaos + in-house hiring complexity.",
  },
];

function WhyCard({
  icon: Icon,
  title,
  desc,
  delay,
}: {
  icon: typeof Code2;
  title: string;
  desc: string;
  delay: number;
}) {
  const { ref, onMouseMove, onMouseLeave } = useTilt();

  return (
    <ScrollReveal delay={delay}>
      <Card
        ref={ref as React.Ref<HTMLDivElement>}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="group relative border-border/50 bg-off-white hover:shadow-md transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-emerald after:scale-x-0 after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-500"
      >
        <CardContent className="p-6">
          <Icon className="size-6 text-emerald mb-4" />
          <h3 className="font-heading text-lg font-semibold text-espresso mb-2">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {desc}
          </p>
        </CardContent>
      </Card>
    </ScrollReveal>
  );
}

export function WhySection() {
  return (
    <section className="py-24 px-6 bg-bone">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-14">
            <SectionLabel>Our Edge</SectionLabel>
            <h2 className="font-heading text-3xl md:text-4xl font-light text-espresso mt-3">
              Why Synked.ai?
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <WhyCard key={item.title} {...item} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
