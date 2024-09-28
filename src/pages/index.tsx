// src/pages/index.tsx
import React, { useEffect, useState } from "react";

import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CallToAction } from "@/components/landing/cta";
import { CashClipsPricing } from "@/components/landing/pricing";
import { DefaultSeo } from "next-seo";
import { HeroSection } from "@/components/landing/hero";
import { HowItWorksSection } from "@/components/landing/how-it-works";
import Script from "next/script";
import { SocialProofTestimonials } from "@/components/landing/testimonials";
import defaultSEO from "../../seo.config";
import { motion } from "framer-motion";

const LandingPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > window.innerHeight * 3.5;
      setIsVisible(shouldShow);
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <DefaultSeo {...defaultSEO} />
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-4 right-4"
      >
        {isVisible && (
          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            size="icon"
            variant="outline"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        )}
      </motion.div>
    </>
  );
};

export default LandingPage;
