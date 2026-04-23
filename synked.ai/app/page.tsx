import { Hero } from "@/components/home/Hero";
import { OverlapSection } from "@/components/home/OverlapSection";
import { PulseSection } from "@/components/home/PulseSection";
import { SyncSection } from "@/components/home/SyncSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { WhySection } from "@/components/home/WhySection";
import { IndustriesSection } from "@/components/home/IndustriesSection";
import { TickerBand } from "@/components/shared/TickerBand";
import { CTABanner } from "@/components/shared/CTABanner";

export const metadata = {
  title: "Synked.ai — AI Agent Automation Studio",
  description:
    "We design, deploy, and continuously manage intelligent AI agents that automate workflows, handle customer interactions, and integrate seamlessly into your existing systems.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TickerBand />
      <OverlapSection />
      <PulseSection />
      <SyncSection />
      <ServicesSection />
      <WhySection />
      <IndustriesSection />
      <CTABanner
        heading="Ready to Synk Your Systems?"
        sub="Let's design an AI architecture that actually works for your business."
        cta="Get in Touch"
        href="/contact"
      />
    </>
  );
}
