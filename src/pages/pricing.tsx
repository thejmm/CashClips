// src/pages/pricing.tsx
import { CashClipsPricing } from "@/components/landing/pricing";
import { NextSeo } from "next-seo";
import React from "react";
import Script from "next/script";

export default function PricingPage() {
  return (
    <>
      <NextSeo
        title="Pricing - CashClips"
        description="Explore CashClips pricing plans. Choose the plan that suits your needs and start creating amazing content today."
        canonical="https://cashclips.io/pricing"
        openGraph={{
          url: "https://cashclips.io/pricing",
          title: "Pricing - CashClips",
          description:
            "Discover the best plan for your content creation needs with CashClips. Explore our pricing options and start creating today.",
          images: [
            {
              url: "https://cashclips.io/seo.svg",
              width: 1200,
              height: 630,
              alt: "CashClips Pricing Plans",
            },
          ],
        }}
        twitter={{
          handle: "@cashclipsio",
          site: "@cashclipsio",
          cardType: "summary_large_image",
        }}
        additionalMetaTags={[
          {
            name: "robots",
            content: "index, follow",
          },
        ]}
        additionalLinkTags={[
          {
            rel: "canonical",
            href: "https://cashclips.io/pricing",
          },
        ]}
      />
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
