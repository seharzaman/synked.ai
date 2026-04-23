"use client";

import { Users, Cpu, Zap, BarChart2, Headphones } from "lucide-react";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { PulseCanvas } from "./PulseCanvas";

const nodes = [
  {
    icon: Users,
    label: "Customer Data",
    sub: "Contacts & history",
    color: "#7F8C43",
  },
  { icon: Cpu, label: "AI Agent", sub: "Smart routing", color: "#125842" },
  { icon: Zap, label: "Automation", sub: "No-code flows", color: "#B089AA" },
  {
    icon: BarChart2,
    label: "Analytics",
    sub: "Live reporting",
    color: "#EBDCC8",
  },
  {
    icon: Headphones,
    label: "Support",
    sub: "24 / 7 coverage",
    color: "#125842",
  },
];

export function PulseSection() {
  return (
    <section className="relative bg-espresso py-24 overflow-hidden">
      <div className="absolute inset-0">
        <PulseCanvas />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <ScrollReveal>
          <h2 className="font-heading text-3xl md:text-4xl font-light text-bone text-center mb-16">
            We bring your systems into <em className="text-pistachio">synk.</em>
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {nodes.map((node, i) => {
            const Icon = node.icon;
            return (
              <ScrollReveal key={node.label} delay={i * 0.1}>
                <div className="group flex flex-col items-center text-center p-4 rounded-lg border border-bone/10 bg-bone/5 hover:bg-bone/10 transition-all duration-300 hover:-translate-y-1">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${node.color}20` }}
                  >
                    <Icon className="size-5" style={{ color: node.color }} />
                  </div>
                  <span className="font-mono text-xs uppercase tracking-wider text-bone/80">
                    {node.label}
                  </span>
                  <span className="text-xs text-bone/40 mt-1">{node.sub}</span>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
