import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { SectionLabel } from "@/components/shared/SectionLabel";

export function OverlapSection() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left - Problem */}
        <ScrollReveal direction="left">
          <div className="relative z-[2]">
            <SectionLabel>The Problem</SectionLabel>
            <h2 className="font-heading text-3xl md:text-4xl font-light text-espresso mt-3 mb-6">
              Businesses are drowning in tool chaos.
            </h2>
            <ul className="space-y-3">
              {[
                "Time wasted on repetitive, manual tasks",
                "Disconnected tools that don't talk to each other",
                "High operational & hiring costs",
                "No AI expertise to build & maintain systems",
                "Generic AI tools with zero customization",
              ].map((item) => (
                <li
                  key={item}
                  className="text-muted-foreground pl-6 relative before:content-['—'] before:absolute before:left-0 before:text-emerald hover:translate-x-1 hover:text-foreground transition-all duration-300"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        {/* Right - Card */}
        <ScrollReveal direction="right">
          <div className="bg-espresso text-bone rounded-lg p-8 md:p-10">
            <span className="font-mono text-xs uppercase tracking-[0.15em] text-bone/50">
              The Result
            </span>
            <blockquote className="font-heading text-xl italic text-bone/90 mt-4 mb-6 pl-4 border-l-2 border-pistachio">
              Inefficient operations and underutilized AI potential.
            </blockquote>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-4xl font-bold text-bone">
                73%
              </span>
              <span className="text-sm text-bone/60">
                of SMEs say AI tools haven&apos;t delivered ROI
              </span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
