import { Pricing } from "@/components/landing/sections/pricing";
import React from "react";

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-20">
      <Pricing showFeaturesTable={true} showBenefitsSection={true} />
    </div>
  );
}
