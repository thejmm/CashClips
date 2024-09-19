import { CashClipsPricing } from "@/components/landing/pricing";
import Head from "next/head";
import React from "react";

export default function PricingPage() {
  return (
    <>
      <Head>
        <script
          async
          src="https://cdn.promotekit.com/promotekit.js"
          data-promotekit="a1ede120-2bf6-4afa-9c88-f9bf10ebbd46"
        />
      </Head>
      <div className="container mx-auto px-4 md:px-8">
        <CashClipsPricing />
      </div>
    </>
  );
}
