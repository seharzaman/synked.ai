import { Hero } from "@/components/home/Hero";
import { OverlapSection } from "@/components/home/OverlapSection";
import { PulseSection } from "@/components/home/PulseSection";
import { SyncSection } from "@/components/home/SyncSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { WhySection } from "@/components/home/WhySection";
import { IndustriesSection } from "@/components/home/IndustriesSection";
import { TickerBand } from "@/components/shared/TickerBand";
import { CTABanner } from "@/components/shared/CTABanner";

export default function Home() {
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
