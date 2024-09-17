// src/pages/index.tsx
import { CallToAction } from "@/components/landing/cta";
import { FeaturesSection } from "@/components/landing/features";
import { HeroSection } from "@/components/landing/hero";
import { HowItWorksSection } from "@/components/landing/how-it-works";
import PricingPage from "./pricing";
import React from "react";
import { SocialProofTestimonials } from "@/components/landing/testimonials";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <SocialProofTestimonials />
      <PricingPage />
      <CallToAction />
    </div>
  );
};

export default LandingPage;
