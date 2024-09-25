// src/pages/index.tsx
import { CallToAction } from "@/components/landing/cta";
import { CashClipsPricing } from "@/components/landing/pricing";
import { FeaturesSection } from "@/components/landing/features";
import { HeroSection } from "@/components/landing/hero";
import { HowItWorksSection } from "@/components/landing/how-it-works";
import React from "react";
import Script from "next/script";
import { SocialProofTestimonials } from "@/components/landing/testimonials";

const LandingPage: React.FC = () => {
  return (
    <>
      <Script
        src="https://cdn.promotekit.com/promotekit.js"
        data-promotekit="a1ede120-2bf6-4afa-9c88-f9bf10ebbd46"
        strategy="afterInteractive"
      />
      <div className="min-h-screen bg-background">
        <HeroSection />
        <HowItWorksSection />
        <SocialProofTestimonials />
        <CashClipsPricing />
        <CallToAction />
      </div>
    </>
  );
};

export default LandingPage;
