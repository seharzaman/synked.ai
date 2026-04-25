import { Link } from "react-router-dom";
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
            to={href}
            style={{
              display: "inline-block",
              padding: "1rem 2.6rem",
              background: "var(--color-emerald)",
              color: "white",
              borderRadius: 2,
              fontSize: "0.88rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
              textDecoration: "none",
              fontWeight: 500,
              border: "2px solid var(--color-emerald)",
              transition: "all 0.3s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.background = "transparent";
              el.style.color = "var(--color-emerald)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.background = "var(--color-emerald)";
              el.style.color = "white";
            }}
          >
            {cta}
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
