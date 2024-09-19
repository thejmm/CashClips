import { CashClipsPricing } from "@/components/landing/pricing";
import Head from "next/head";
import React from "react";
import Script from "next/script";

export default function PricingPage() {
  return (
    <>
      <Script
        src="https://cdn.promotekit.com/promotekit.js"
        data-promotekit="a1ede120-2bf6-4afa-9c88-f9bf10ebbd46"
        strategy="afterInteractive"
      />
      <div className="container mx-auto px-4 md:px-8">
        <CashClipsPricing showFeaturesTable={true} showBenefitsSection={true} />
      </div>
    </>
  );
}
