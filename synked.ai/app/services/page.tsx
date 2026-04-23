"use client";

import Link from "next/link";
import {
  MessageCircle,
  Target,
  Settings2,
  FileText,
  Search,
  Shield,
  PlugZap,
  Zap,
  Workflow,
  BarChart2,
  Brain,
  Rocket,
} from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { SectionLabel } from "@/components/shared/SectionLabel";
import { CTABanner } from "@/components/shared/CTABanner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { serviceDeepDive, pricingCards } from "@/data/services";

/* Icon map */
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageCircle,
  Target,
  Settings2,
  FileText,
  Search,
  Shield,
  PlugZap,
  Zap,
  Workflow,
  BarChart2,
  Brain,
  Rocket,
};

/* ---------- VISUALS ---------- */
function ChatVisual() {
  return (
    <div className="bg-off-white border border-border/50 rounded-lg p-4 font-mono text-xs">
      <div className="flex gap-1.5 mb-3">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald" />
        <span className="w-2.5 h-2.5 rounded-full bg-pistachio" />
        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
      </div>
      <div className="space-y-2">
        <div className="bg-emerald/10 text-emerald px-3 py-2 rounded-lg w-fit">
          How can I help you today?
        </div>
        <div className="bg-muted px-3 py-2 rounded-lg w-fit ml-auto text-foreground">
          What&apos;s your return policy?
        </div>
        <div className="bg-emerald/10 text-emerald px-3 py-2 rounded-lg w-fit flex gap-1 items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse [animation-delay:0.15s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse [animation-delay:0.3s]" />
        </div>
      </div>
    </div>
  );
}

function RAGVisual() {
  return (
    <div className="bg-espresso border border-bone/10 rounded-lg p-4 font-mono text-xs text-bone">
      <div className="space-y-1.5 mb-3">
        {["Company Policy v3.pdf", "Q4 Report.xlsx", "Onboarding Guide.md"].map(
          (f) => (
            <div key={f} className="bg-bone/10 px-3 py-1.5 rounded">
              {f}
            </div>
          ),
        )}
        <div className="bg-emerald/20 text-emerald px-3 py-1.5 rounded">
          Indexed → Vector DB
        </div>
      </div>
      <div className="text-center text-bone/40 my-2">↓</div>
      <div className="bg-bone/10 px-3 py-2 rounded text-center text-bone/80">
        AI with full context
      </div>
    </div>
  );
}

function FlowVisual() {
  return (
    <div className="bg-off-white border border-border/50 rounded-lg p-4">
      <div className="flex items-center justify-center gap-2 font-mono text-[10px] uppercase">
        {["Trigger", "AI Agent", "CRM Update", "Slack Alert"].map((n, i) => (
          <span key={n} className="contents">
            {i > 0 && <span className="text-muted-foreground">→</span>}
            <span
              className={`px-3 py-1.5 rounded ${i === 0 ? "bg-emerald text-white" : "bg-muted text-foreground"}`}
            >
              {n}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function MetricsVisual() {
  const metrics = [
    { label: "Response accuracy", val: "97.3%", width: 97 },
    { label: "Resolved without human", val: "84%", width: 84 },
    { label: "Avg. response time", val: "< 1.2s", width: 60 },
  ];
  return (
    <div className="bg-espresso border border-bone/10 rounded-lg p-4 font-mono text-xs text-bone space-y-3">
      {metrics.map((m) => (
        <div key={m.label}>
          <div className="flex justify-between mb-1">
            <span className="text-bone/60">{m.label}</span>
            <span>{m.val}</span>
          </div>
          <div className="h-1.5 bg-bone/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-pistachio rounded-full"
              style={{
                width: `${m.width}%`,
                animation: "barFill 1.5s ease both",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

const visuals = [
  <ChatVisual key="v1" />,
  <RAGVisual key="v2" />,
  <FlowVisual key="v3" />,
  <MetricsVisual key="v4" />,
];

/* ---------- SERVICE DEEP DIVE ---------- */
function ServiceDeepDive() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto space-y-20">
      {serviceDeepDive.map((svc, i) => {
        const isReverse = i % 2 === 1;
        return (
          <div key={svc.id} id={svc.id} className="scroll-mt-24">
            <div
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-start ${isReverse ? "lg:direction-rtl" : ""}`}
            >
              {/* Content */}
              <ScrollReveal direction={isReverse ? "right" : "left"}>
                <div className={isReverse ? "lg:direction-ltr" : ""}>
                  <span className="font-mono text-xs text-muted-foreground">
                    {svc.num}
                  </span>
                  <div className="flex items-center gap-3 mt-1 mb-4">
                    <h2 className="font-heading text-2xl md:text-3xl font-light text-espresso">
                      {svc.title}
                    </h2>
                    <Badge variant="outline" className="text-xs">
                      {svc.tag}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {svc.desc}
                  </p>
                  <div className="space-y-4">
                    {svc.features.map((f) => {
                      const Icon = f.icon;
                      return (
                        <div key={f.title} className="flex gap-3">
                          <div className="mt-1">
                            {Icon && <Icon className="size-5 text-emerald" />}
                          </div>
                          <div>
                            <h4 className="font-heading text-sm font-semibold text-espresso">
                              {f.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {f.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ScrollReveal>

              {/* Visual */}
              <ScrollReveal direction={isReverse ? "left" : "right"}>
                <div className={isReverse ? "lg:direction-ltr" : ""}>
                  {visuals[i]}
                </div>
              </ScrollReveal>
            </div>

            {i < serviceDeepDive.length - 1 && (
              <div className="h-px bg-border mt-20" />
            )}
          </div>
        );
      })}
    </section>
  );
}

/* ---------- PRICING ---------- */
function PricingSection() {
  return (
    <section className="py-24 px-6 bg-bone">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-14">
            <SectionLabel>Business Model</SectionLabel>
            <h2 className="font-heading text-3xl md:text-4xl font-light text-espresso mt-3">
              Transparent. <em>Flexible.</em>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingCards.map((card, i) => (
            <ScrollReveal key={card.title} delay={i * 0.1}>
              <Card
                className={`h-full border-border/50 bg-off-white ${card.featured ? "ring-2 ring-emerald/30 relative" : ""}`}
              >
                {card.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-emerald text-white text-xs">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6 flex flex-col h-full">
                  <h3 className="font-heading text-xl font-semibold text-espresso mb-1">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {card.desc}
                  </p>
                  <ul className="space-y-2 mb-6 flex-1">
                    {card.features.map((item) => (
                      <li
                        key={item}
                        className="text-sm text-muted-foreground pl-4 relative before:content-['✓'] before:absolute before:left-0 before:text-emerald before:text-xs"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    variant={card.featured ? "default" : "ghost"}
                    className="w-full"
                  >
                    <Link href="/contact">{card.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- PAGE ---------- */
export default function ServicesPage() {
  return (
    <>
      <PageHero
        label="What We Build"
        heading={
          <>
            Services that
            <br />
            <em>move businesses</em>
            <br />
            forward.
          </>
        }
        sub="Full-stack AI systems designed, deployed, and managed for real-world results."
      />
      <ServiceDeepDive />
      <PricingSection />
      <CTABanner
        heading="Let's build your AI system."
        sub="Tell us about your business and we'll design the right solution."
        cta="Start the Conversation"
        href="/contact"
      />
    </>
  );
}
