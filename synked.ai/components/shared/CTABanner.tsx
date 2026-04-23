import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

interface CTABannerProps {
  heading: string;
  sub: string;
  cta: string;
  href?: string;
}

export function CTABanner({
  heading,
  sub,
  cta,
  href = "/contact",
}: CTABannerProps) {
  return (
    <section className="relative bg-espresso py-24 overflow-hidden">
      {/* Watercolor blob */}
      <div
        className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] opacity-15 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(127,140,67,0.3), rgba(235,220,198,0.1))",
          borderRadius: "40% 60% 60% 40% / 60% 30% 70% 40%",
          animation: "morphBlob 12s ease-in-out infinite",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
        <ScrollReveal>
          <h2 className="font-heading text-3xl md:text-4xl font-light text-bone mb-4">
            {heading}
          </h2>
          <p className="text-bone/60 mb-8">{sub}</p>
          <Button asChild size="lg">
            <Link href={href}>{cta}</Link>
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}
