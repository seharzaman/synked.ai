import { Link } from "react-router-dom";
import { footerLinks } from "@/data/navigation";

export function Footer() {
  return (
    <footer
      style={{
        background: "var(--color-espresso)",
        padding: "4rem 5vw 2rem",
        borderTop: "1px solid rgba(235,220,200,0.08)",
        color: "var(--color-bone)",
      }}
    >
      {/* Top */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "3rem",
          marginBottom: "3rem",
          flexWrap: "wrap",
        }}
      >
        {/* Brand */}
        <div>
          <div
            className="font-heading"
            style={{
              fontSize: "1.3rem",
              fontWeight: 600,
              color: "var(--color-bone)",
              letterSpacing: "0.05em",
            }}
          >
            Synked.ai
          </div>
          <p
            style={{
              fontSize: "0.83rem",
              color: "var(--color-bone)",
              opacity: 0.4,
              marginTop: "0.7rem",
            }}
          >
            Sync Your Business with AI.
          </p>
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: "4rem" }}>
          {/* Company */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}
          >
            <h5
              className="font-mono"
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--color-pistachio)",
                marginBottom: "0.3rem",
              }}
            >
              Company
            </h5>
            {footerLinks.company.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                style={{
                  fontSize: "0.84rem",
                  color: "var(--color-bone)",
                  opacity: 0.42,
                  textDecoration: "none",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.opacity = "0.9")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.opacity = "0.42")
                }
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Demos */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}
          >
            <h5
              className="font-mono"
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--color-pistachio)",
                marginBottom: "0.3rem",
              }}
            >
              Demos
            </h5>
            {footerLinks.demos.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                style={{
                  fontSize: "0.84rem",
                  color: "var(--color-bone)",
                  opacity: 0.42,
                  textDecoration: "none",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.opacity = "0.9")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.opacity = "0.42")
                }
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Services */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}
          >
            <h5
              className="font-mono"
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--color-pistachio)",
                marginBottom: "0.3rem",
              }}
            >
              Services
            </h5>
            {footerLinks.services.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                style={{
                  fontSize: "0.84rem",
                  color: "var(--color-bone)",
                  opacity: 0.42,
                  textDecoration: "none",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.opacity = "0.9")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.opacity = "0.42")
                }
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div
        className="font-mono"
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.78rem",
          color: "var(--color-bone)",
          opacity: 0.3,
          borderTop: "1px solid rgba(235,220,200,0.08)",
          paddingTop: "1.5rem",
        }}
      >
        <p>© 2026 Synked.ai — All rights reserved.</p>
        <a
          href="mailto:hello@synked.ai"
          style={{
            color: "inherit",
            textDecoration: "none",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = "1")}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = "")}
        >
          hello@synked.ai
        </a>
      </div>
    </footer>
  );
}
