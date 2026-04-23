"use client";

import {
  Mail,
  Clock,
  ArrowRightCircle,
  PhoneCall,
  Layout,
  Rocket,
  Activity,
} from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { SectionLabel } from "@/components/shared/SectionLabel";
import Script from "next/script";

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

export default function ContactPage() {
  return (
    <>
      <PageHero
        label="Let's Talk"
        heading={
          <>
            Start the
            <br />
            <em>conversation.</em>
          </>
        }
        sub="Tell us about your business. We'll design an AI system that actually delivers."
      />

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
          {/* Left info */}
          <div>
            <ScrollReveal direction="left">
              <SectionLabel>Reach Out</SectionLabel>
              <h2 className="font-heading text-3xl md:text-4xl font-light text-espresso mt-3 mb-8">
                We&apos;d love to
                <br />
                hear from you.
              </h2>

              <div className="space-y-5 mb-10">
                <div>
                  <span className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    <Mail className="size-3.5" /> Email
                  </span>
                  <a
                    href="mailto:hello@synked.ai"
                    className="text-espresso hover:text-emerald transition-colors font-medium"
                  >
                    hello@synked.ai
                  </a>
                </div>
                <div>
                  <span className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    <Clock className="size-3.5" /> Response Time
                  </span>
                  <span className="text-espresso font-medium">
                    Within 24 hours
                  </span>
                </div>
                <div>
                  <span className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    <ArrowRightCircle className="size-3.5" /> What Happens Next
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We review your message, schedule a discovery call, and
                    outline a custom AI system for your business; no commitment
                    required.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={0.1}>
              <SectionLabel>Our Process</SectionLabel>
              <div className="space-y-4 mt-4">
                {processSteps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.title} className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-full bg-emerald/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="size-4 text-emerald" />
                      </div>
                      <div>
                        <h5 className="font-heading text-sm font-semibold text-espresso">
                          {step.title}
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollReveal>
          </div>

          {/* Right - GHL Form */}
          <ScrollReveal direction="right">
            <div className="min-h-[1106px] rounded-lg overflow-hidden border border-border/50 bg-off-white">
              <iframe
                src="https://api.leadconnectorhq.com/widget/form/VdX10GaaYT1eVph0ngwE"
                className="w-full h-full border-none rounded-lg"
                style={{ minHeight: "1106px" }}
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
        </div>
      </section>

      {/* GHL embed script */}
      <Script
        src="https://link.msgsndr.com/js/form_embed.js"
        strategy="lazyOnload"
      />
    </>
  );
}
