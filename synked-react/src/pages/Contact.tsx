import { useEffect } from "react";
import {
  Mail,
  Clock,
  ArrowRightCircle,
  PhoneCall,
  Layout,
  Rocket,
  Activity,
} from "lucide-react";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

const processSteps = [
  {
    icon: PhoneCall,
    title: "Discovery Call",
    desc: "We understand your business, pain points, and AI goals.",
  },
  {
    icon: Layout,
    title: "System Design",
    desc: "We architect a custom AI solution tailored to your workflows.",
  },
  {
    icon: Rocket,
    title: "Build & Deploy",
    desc: "We build, test, and deploy your AI system into your existing stack.",
  },
  {
    icon: Activity,
    title: "Ongoing Management",
    desc: "We monitor, optimize, and scale, month after month.",
  },
];

/* ---------- HERO ---------- */
function ContactHero() {
  return (
    <section
      className="relative overflow-hidden flex items-end"
      style={{
        minHeight: "60vh",
        padding: "calc(var(--nav-h) + 4rem) 5vw 5rem",
        background: "var(--color-off-white)",
      }}
    >
      {/* Background blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute"
          style={{
            width: "40vw",
            height: "40vw",
            top: "-10%",
            right: "-5%",
            borderRadius: "60% 40% 70% 30% / 50% 60% 40% 70%",
            filter: "blur(50px)",
            opacity: 0.45,
            background: "radial-gradient(ellipse, #c8d5bc 0%, transparent 70%)",
            animation: "morphBlob 12s ease-in-out infinite",
          }}
        />
        <div
          className="absolute"
          style={{
            width: "30vw",
            height: "30vw",
            bottom: "-10%",
            left: "10%",
            borderRadius: "60% 40% 70% 30% / 50% 60% 40% 70%",
            filter: "blur(50px)",
            opacity: 0.45,
            background: "radial-gradient(ellipse, #ddd5c0 0%, transparent 70%)",
            animation: "morphBlob 10s ease-in-out infinite reverse",
          }}
        />
      </div>

      <div className="relative z-[1]">
        <ScrollReveal>
          <span
            className="inline-block font-mono uppercase tracking-[0.18em] text-pistachio"
            style={{
              fontSize: "0.7rem",
              marginBottom: "1rem",
              display: "block",
            }}
          >
            Let&apos;s Talk
          </span>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h1
            className="font-heading font-light text-espresso"
            style={{
              fontSize: "clamp(3.5rem, 7vw, 7rem)",
              lineHeight: 1.05,
              margin: "0.5rem 0 1rem",
            }}
          >
            Start the
            <br />
            <em style={{ color: "var(--color-emerald)" }}>conversation.</em>
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--color-text-mid, #4a4840)",
              maxWidth: 440,
              lineHeight: 1.7,
              marginTop: "1rem",
            }}
          >
            Tell us about your business. We&apos;ll design an AI system that
            actually delivers.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ---------- PAGE ---------- */
export function ContactPage() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://link.msgsndr.com/js/form_embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <ContactHero />

      {/* Contact Section */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.2fr",
          gap: "6rem",
          padding: "8rem 5vw",
          background: "var(--color-white, #fff)",
          alignItems: "start",
        }}
      >
        {/* Left info — sticky */}
        <div
          style={{
            position: "sticky",
            top: "calc(var(--nav-h) + 2rem)",
          }}
        >
          <ScrollReveal direction="left">
            <span
              className="inline-block font-mono uppercase tracking-[0.18em] text-pistachio"
              style={{
                fontSize: "0.7rem",
                marginBottom: "1rem",
                display: "block",
              }}
            >
              Reach Out
            </span>
            <h2
              className="font-heading font-light text-espresso"
              style={{
                fontSize: "clamp(2.5rem, 4vw, 3.8rem)",
                lineHeight: 1.2,
                margin: "0.5rem 0 2.5rem",
              }}
            >
              We&apos;d love to
              <br />
              hear from you.
            </h2>

            {/* Contact info */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                marginBottom: "3rem",
                paddingBottom: "3rem",
                borderBottom: "1px solid rgba(0,0,0,0.07)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                }}
              >
                <span
                  className="font-mono uppercase text-pistachio"
                  style={{
                    fontSize: "0.62rem",
                    letterSpacing: "0.15em",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Mail style={{ width: 13, height: 13 }} />
                  Email
                </span>
                <a
                  href="mailto:hello@synked.ai"
                  className="text-espresso hover:text-emerald transition-colors"
                  style={{ fontSize: "1rem", textDecoration: "none" }}
                >
                  hello@synked.ai
                </a>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                }}
              >
                <span
                  className="font-mono uppercase text-pistachio"
                  style={{
                    fontSize: "0.62rem",
                    letterSpacing: "0.15em",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Clock style={{ width: 13, height: 13 }} />
                  Response Time
                </span>
                <span className="text-espresso" style={{ fontSize: "1rem" }}>
                  Within 24 hours
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                }}
              >
                <span
                  className="font-mono uppercase text-pistachio"
                  style={{
                    fontSize: "0.62rem",
                    letterSpacing: "0.15em",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <ArrowRightCircle style={{ width: 13, height: 13 }} />
                  What Happens Next
                </span>
                <p
                  className="text-muted-foreground"
                  style={{
                    fontSize: "0.88rem",
                    lineHeight: 1.65,
                    maxWidth: 320,
                    margin: 0,
                  }}
                >
                  We review your message, schedule a discovery call, and outline
                  a custom AI system for your business; no commitment required.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Process */}
          <ScrollReveal direction="left" delay={0.1}>
            <div style={{ marginTop: "2rem" }}>
              <span
                className="inline-block font-mono uppercase tracking-[0.18em] text-pistachio"
                style={{
                  fontSize: "0.7rem",
                  marginBottom: "1.5rem",
                  display: "block",
                }}
              >
                Our Process
              </span>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.2rem",
                }}
              >
                {processSteps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.title}
                      style={{
                        display: "flex",
                        gap: "1.2rem",
                        alignItems: "flex-start",
                      }}
                    >
                      <span
                        className="text-pistachio"
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.62rem",
                          letterSpacing: "0.12em",
                          paddingTop: "0.25rem",
                          flexShrink: 0,
                        }}
                      >
                        <Icon style={{ width: 16, height: 16 }} />
                      </span>
                      <div>
                        <h5
                          className="font-heading text-espresso"
                          style={{
                            fontSize: "1.05rem",
                            fontWeight: 400,
                            marginBottom: "0.2rem",
                          }}
                        >
                          {step.title}
                        </h5>
                        <p
                          className="text-muted-foreground"
                          style={{
                            fontSize: "0.83rem",
                            lineHeight: 1.6,
                            margin: 0,
                          }}
                        >
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Right - GHL Form */}
        <ScrollReveal direction="right">
          <div
            style={{
              background: "var(--color-off-white)",
              borderRadius: 6,
              padding: "3rem",
              border: "1px solid rgba(0,0,0,0.06)",
              minHeight: 1106,
            }}
          >
            <iframe
              src="https://api.leadconnectorhq.com/widget/form/VdX10GaaYT1eVph0ngwE"
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                borderRadius: 8,
                minHeight: 1106,
              }}
              id="inline-VdX10GaaYT1eVph0ngwE"
              data-layout='{"id":"INLINE"}'
              data-trigger-type="alwaysShow"
              data-activation-type="alwaysActivated"
              data-deactivation-type="neverDeactivate"
              data-form-name="Contact Form"
              data-height="1106"
              data-layout-iframe-id="inline-VdX10GaaYT1eVph0ngwE"
              data-form-id="VdX10GaaYT1eVph0ngwE"
              title="Contact Form"
            />
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
