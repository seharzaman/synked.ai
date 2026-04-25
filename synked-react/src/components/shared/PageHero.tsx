import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { SectionLabel } from "@/components/shared/SectionLabel";

interface PageHeroProps {
  label: string;
  heading: React.ReactNode;
  sub?: string;
  className?: string;
}

export function PageHero({
  label,
  heading,
  sub,
  className = "",
}: PageHeroProps) {
  return (
    <section
      className={`relative pt-32 pb-20 overflow-hidden ${className}`}
      style={{ paddingTop: "calc(var(--nav-h) + 4rem)" }}
    >
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] opacity-20"
          style={{
            background: "radial-gradient(circle, #c8d5bc, transparent 70%)",
            animation: "morphBlob 12s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-[-10%] left-[-5%] w-[350px] h-[350px] opacity-15"
          style={{
            background: "radial-gradient(circle, #ddd5c0, transparent 70%)",
            animation: "morphBlob 15s ease-in-out infinite reverse",
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <ScrollReveal>
          <SectionLabel>{label}</SectionLabel>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light text-espresso mt-4 mb-6">
            {heading}
          </h1>
        </ScrollReveal>
        {sub && (
          <ScrollReveal delay={0.2}>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {sub}
            </p>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
