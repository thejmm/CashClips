// src/pages/index.tsx
import { Box, Layers, Palette, Zap } from "lucide-react";

import { CallToAction } from "@/components/landing/sections/cta";
import { FAQ } from "@/components/landing/sections/faq";
import Features from "@/components/landing/sections/features";
import Hero from "@/components/landing/sections/hero";
import { HowItWorksSection } from "@/components/landing/sections/how-it-works";
import { Pricing } from "@/components/landing/sections/pricing";
import RetroGrid from "@/components/ui/retro-grid";
import { SocialProofTestimonials } from "@/components/landing/sections/social-proof";
import { Stats } from "@/components/landing/sections/stats";
import WebsiteBuilderFeatures from "@/components/landing/sections/bento-grid";

export default function Home() {
  return (
    <>
      <div className="mx-auto px-4 md:px-8">
        <Hero />
        <WebsiteBuilderFeatures />
        <Stats />
        <Features />
      </div>
      <HowItWorksSection />
      <div className="mx-auto px-4 md:px-8">
        <SocialProofTestimonials />
        <Pricing />
        <CallToAction />
      </div>
    </>
  );
}
