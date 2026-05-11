"use client";

import Link from "next/link";
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
    <section
      style={{
        background: "var(--color-espresso)",
        padding: "7rem 3rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Watercolor blob */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          background:
            "radial-gradient(circle, var(--color-taupe), transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          opacity: 0.07,
          borderRadius: "50%",
          pointerEvents: "none",
          animation: "drift1 20s ease-in-out infinite",
        }}
      />

      <div style={{ position: "relative", zIndex: 2 }}>
        <ScrollReveal>
          <h2
            className="font-heading"
            style={{
              fontSize: "clamp(2.4rem,4vw,3.8rem)",
              fontWeight: 300,
              color: "var(--color-bone)",
              marginBottom: "1rem",
            }}
          >
            {heading}
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--color-bone)",
              opacity: 0.55,
              marginBottom: "2.5rem",
            }}
          >
            {sub}
          </p>
          <Link
            href={href}
            className="inline-block py-4 px-10 bg-emerald text-white rounded-sm text-[0.88rem] tracking-[0.08em] uppercase no-underline font-medium border-2 border-emerald transition-all hover:bg-transparent hover:text-emerald"
          >
            {cta}
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
