// src/pages/index.tsx
import { CallToAction } from "@/components/landing/cta";
import { FeaturesSection } from "@/components/landing/features";
import Head from "next/head";
import { HeroSection } from "@/components/landing/hero";
import { HowItWorksSection } from "@/components/landing/how-it-works";
import PricingPage from "./pricing";
import React from "react";
import { SocialProofTestimonials } from "@/components/landing/testimonials";

const LandingPage: React.FC = () => {
  return (
    <>
      <Head>
        <script
          async
          src="https://cdn.promotekit.com/promotekit.js"
          data-promotekit="a1ede120-2bf6-4afa-9c88-f9bf10ebbd46"
        />
      </Head>
      <div className="min-h-screen bg-background">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <SocialProofTestimonials />
        <PricingPage />
        <CallToAction />
      </div>
    </>
  );
};

export default LandingPage;
