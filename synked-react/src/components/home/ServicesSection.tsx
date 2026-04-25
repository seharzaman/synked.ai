import { Link } from "react-router-dom";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { serviceCards } from "@/data/services";

export function ServicesSection() {
  return (
    <section
      className="services-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        maxWidth: 1200,
        margin: "0 auto",
        padding: "7rem 3rem",
        gap: "6rem",
      }}
      id="whatwedo"
    >
      {/* Sticky left */}
      <div style={{ position: "sticky", top: "8rem", alignSelf: "start" }}>
        <ScrollReveal direction="left">
          <span
            className="font-mono"
            style={{
              fontSize: "0.63rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase" as const,
              color: "var(--color-emerald)",
              display: "block",
              marginBottom: "0.9rem",
            }}
          >
            What We Do
          </span>
          <h2
            className="font-heading"
            style={{
              fontSize: "clamp(2.8rem,4vw,3.8rem)",
              fontWeight: 300,
              lineHeight: 1.15,
              margin: "1rem 0 1.5rem",
            }}
          >
            End-to-end AI.
            <br />
            Built.
            <br />
            <em style={{ fontStyle: "italic", color: "var(--color-emerald)" }}>
              Managed.
            </em>
            <br />
            Optimized.
          </h2>
          <p style={{ fontSize: "0.93rem", opacity: 0.68, lineHeight: 1.75 }}>
            We&apos;re not a tool. We&apos;re your long-term AI partner,
            engineering intelligent systems that grow with your business.
          </p>
        </ScrollReveal>
      </div>

      {/* Right - Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {serviceCards.map((card, i) => (
          <ScrollReveal key={card.num} delay={0.05 + i * 0.07}>
            <div
              style={{
                border: "1px solid rgba(63,42,28,.11)",
                borderRadius: 2,
                padding: "2rem",
                background: "white",
                position: "relative",
                overflow: "hidden",
                transition:
                  "transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s, border-color .3s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = "translateX(7px)";
                el.style.boxShadow = "-5px 8px 32px rgba(63,42,28,.07)";
                el.style.borderColor = "rgba(18,88,66,.18)";
                const bar = el.querySelector("[data-accent]") as HTMLElement;
                if (bar) bar.style.transform = "scaleY(1)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = "";
                el.style.boxShadow = "";
                el.style.borderColor = "";
                const bar = el.querySelector("[data-accent]") as HTMLElement;
                if (bar) bar.style.transform = "scaleY(0)";
              }}
            >
              {/* Left accent bar */}
              <div
                data-accent
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 3,
                  background:
                    "linear-gradient(180deg, var(--color-pistachio), var(--color-emerald))",
                  transform: "scaleY(0)",
                  transformOrigin: "bottom",
                  transition: "transform .35s cubic-bezier(.16,1,.3,1)",
                }}
              />
              <div
                className="font-mono"
                style={{
                  fontSize: "0.62rem",
                  color: "var(--color-pistachio)",
                  letterSpacing: "0.12em",
                  marginBottom: "0.8rem",
                }}
              >
                {card.num}
              </div>
              <h3
                className="font-heading"
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 400,
                  marginBottom: "0.8rem",
                }}
              >
                {card.title}
              </h3>
              <p
                style={{
                  fontSize: "0.88rem",
                  opacity: 0.68,
                  lineHeight: 1.68,
                  marginBottom: "1rem",
                }}
              >
                {card.desc}
              </p>
              <Link
                to={card.href}
                className="font-mono"
                style={{
                  fontSize: "0.66rem",
                  letterSpacing: "0.1em",
                  color: "var(--color-emerald)",
                  textDecoration: "none",
                  transition: "opacity .2s",
                }}
              >
                Learn more →
              </Link>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
