"use client";

import {
  Code2,
  Handshake,
  Lightbulb,
  TrendingUp,
  BrainCircuit,
  Code,
  Briefcase,
  CheckCircle,
  Clock,
  Star,
} from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { SectionLabel } from "@/components/shared/SectionLabel";
import { CTABanner } from "@/components/shared/CTABanner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/* ---------- MISSION ---------- */
function MissionSection() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
        <div className="lg:sticky" style={{ top: "calc(var(--nav-h) + 2rem)" }}>
          <ScrollReveal direction="left">
            <SectionLabel>Mission</SectionLabel>
            <blockquote className="font-heading text-xl md:text-2xl italic text-espresso leading-relaxed mt-4 pl-5 border-l-2 border-emerald">
              &ldquo;To help businesses synk their operations with intelligent
              AI agents that are not only built, but continuously optimized and
              managed by experts.&rdquo;
            </blockquote>
          </ScrollReveal>
        </div>
        <ScrollReveal direction="right">
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              We founded Synked.ai with a simple observation: most businesses{" "}
              <em className="text-foreground">want</em> to benefit from AI, but
              the path from intention to actual results is full of dead ends,
              including generic tools, disconnected systems, and no one
              accountable for outcomes.
            </p>
            <p>
              We exist to close that gap. We&apos;re not a tool. We&apos;re not
              a course. We&apos;re the team that builds, deploys, and
              continuously manages the AI infrastructure your business needs to
              scale.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ---------- VISION ---------- */
function VisionSection() {
  return (
    <section className="bg-emerald py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <ScrollReveal>
          <SectionLabel className="text-bone/50">Vision</SectionLabel>
          <h2 className="font-heading text-3xl md:text-4xl font-light text-bone mt-3 leading-snug">
            To become a leading provider of AI-driven business automation
            solutions: <em>globally.</em>
          </h2>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ---------- VALUES ---------- */
const values = [
  {
    icon: Code2,
    title: "Engineering, not wrappers.",
    desc: "We build real AI systems such as custom LLM integrations, vector databases, multi-agent pipelines. Not just ChatGPT with a new interface.",
  },
  {
    icon: Handshake,
    title: "Partnership over projects.",
    desc: "We stay. We manage. We improve. Our success is measured by your outcomes, not our delivery date.",
  },
  {
    icon: Lightbulb,
    title: "Clarity over complexity.",
    desc: "AI is complex; your experience of it shouldn't be. We translate technical depth into simple, measurable business results.",
  },
  {
    icon: TrendingUp,
    title: "Outcomes, not outputs.",
    desc: 'We track resolution rates, cost savings, and time recaptured, not just "deployments."',
  },
];

function ValuesSection() {
  return (
    <section className="py-24 px-6 bg-bone">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-14">
            <SectionLabel>What Drives Us</SectionLabel>
            <h2 className="font-heading text-3xl md:text-4xl font-light text-espresso mt-3">
              Our values
            </h2>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <ScrollReveal key={v.title} delay={i * 0.1}>
                <Card className="border-border/50 bg-off-white hover:shadow-md transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <Icon className="size-5 text-emerald mb-4" />
                    <h3 className="font-heading text-lg font-semibold text-espresso mb-2">
                      {v.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {v.desc}
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- TEAM ---------- */
const team = [
  {
    icon: BrainCircuit,
    role: "AI / ML Engineer",
    area: "Architecture & Intelligence",
    bio: "Custom LLM integrations, RAG pipeline design, prompt engineering, and fine-tuning strategy. The technical core of every system we build.",
    accent: "bg-emerald/10 text-emerald",
  },
  {
    icon: Code,
    role: "Software Developers",
    area: "Integration & Deployment",
    bio: "Backend engineering, API integrations, secure deployment, and scalable infrastructure. They turn AI architectures into production-grade systems.",
    accent: "bg-pistachio/10 text-pistachio",
  },
  {
    icon: Briefcase,
    role: "Business Development",
    area: "Strategy & Partnerships",
    bio: "Understanding your business deeply, designing the right solution scope, and ensuring every engagement delivers clear, measurable ROI.",
    accent: "bg-taupe/10 text-taupe",
  },
];

function TeamSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-14">
            <SectionLabel>The Team</SectionLabel>
            <h2 className="font-heading text-3xl md:text-4xl font-light text-espresso mt-3">
              Expert humans building expert <em>machines.</em>
            </h2>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((t, i) => {
            const Icon = t.icon;
            return (
              <ScrollReveal key={t.role} delay={i * 0.12}>
                <Card className="border-border/50 bg-off-white hover:shadow-md transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${t.accent}`}
                    >
                      <Icon className="size-6" />
                    </div>
                    <h4 className="font-heading text-lg font-semibold text-espresso">
                      {t.role}
                    </h4>
                    <p className="font-mono text-xs text-muted-foreground mb-3">
                      {t.area}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t.bio}
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- ROADMAP ---------- */
const phases = [
  {
    phase: "Phase 1",
    title: "Managed AI Services",
    desc: "Agency model, building and managing custom AI systems for businesses across verticals.",
    status: "Now",
    icon: CheckCircle,
    statusClass: "bg-emerald/10 text-emerald",
  },
  {
    phase: "Phase 2",
    title: "Productized Solutions",
    desc: "Packaged, repeatable AI solutions by industry, faster deployment, proven results.",
    status: "Coming Soon",
    icon: Clock,
    statusClass: "bg-pistachio/10 text-pistachio",
  },
  {
    phase: "Phase 3",
    title: "SaaS Platform",
    desc: "A self-serve platform with managed agents, AI infrastructure for every business, at scale.",
    status: "Future",
    icon: Star,
    statusClass: "bg-taupe/10 text-taupe",
  },
];

function RoadmapSection() {
  return (
    <section className="py-24 px-6 bg-bone">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-14">
            <SectionLabel>Growth Plan</SectionLabel>
            <h2 className="font-heading text-3xl md:text-4xl font-light text-espresso mt-3">
              Where we&apos;re going.
            </h2>
          </div>
        </ScrollReveal>
        <div className="relative space-y-6">
          {/* Timeline bar */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden md:block" />
          {phases.map((p, i) => {
            const StatusIcon = p.icon;
            return (
              <ScrollReveal key={p.phase} delay={i * 0.1}>
                <div className="relative flex gap-6 items-start md:pl-12">
                  <div className="hidden md:flex absolute left-0 w-12 justify-center">
                    <div
                      className={`w-3 h-3 rounded-full mt-2 ${i === 0 ? "bg-emerald" : "bg-border"}`}
                    />
                  </div>
                  <Card
                    className={`flex-1 border-border/50 ${i === 0 ? "ring-1 ring-emerald/20" : ""} bg-off-white`}
                  >
                    <CardContent className="p-6">
                      <span className="font-mono text-xs text-muted-foreground">
                        {p.phase}
                      </span>
                      <h4 className="font-heading text-lg font-semibold text-espresso mt-1 mb-2">
                        {p.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        {p.desc}
                      </p>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${p.statusClass}`}
                      >
                        <StatusIcon className="size-3 mr-1" />
                        {p.status}
                      </Badge>
                    </CardContent>
                  </Card>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- PAGE ---------- */
export default function AboutPage() {
  return (
    <>
      <PageHero
        label="Our Story"
        heading={
          <>
            We synk businesses
            <br />
            <em>with the future</em>
            <br />
            of intelligence.
          </>
        }
      />
      <MissionSection />
      <VisionSection />
      <ValuesSection />
      <TeamSection />
      <RoadmapSection />
      <CTABanner
        heading="Work with us."
        sub="Let's understand your business and design the right AI system."
        cta="Get in Touch"
        href="/contact"
      />
    </>
  );
}
