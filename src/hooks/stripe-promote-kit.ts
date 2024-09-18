// src/hooks/stripe-promote-kit.ts

import { useEffect } from "react";

export function useStripePaymentLinks() {
  useEffect(() => {
    const updateLinks = () => {
      if (typeof window !== "undefined") {
        const referralId = (window as any).promotekit_referral;

        document
          .querySelectorAll('a[href^="https://buy.stripe.com/"]')
          .forEach((element) => {
            if (element instanceof HTMLAnchorElement) {
              const oldBuyUrl = element.href;
              if (!oldBuyUrl.includes("client_reference_id")) {
                const newBuyUrl = `${oldBuyUrl}${
                  oldBuyUrl.includes("?") ? "&" : "?"
                }client_reference_id=${referralId}`;
                element.href = newBuyUrl;
              }
            }
          });

        document.querySelectorAll("[pricing-table-id]").forEach((element) => {
          if (element instanceof HTMLElement) {
            element.setAttribute("client-reference-id", referralId);
          }
        });

        document.querySelectorAll("[buy-button-id]").forEach((element) => {
          if (element instanceof HTMLElement) {
            element.setAttribute("client-reference-id", referralId);
          }
        });
      }
    };

    // Wait for PromoteKit to initialize
    setTimeout(updateLinks, 1500);

    // Re-run on route changes
    window.addEventListener("routeChangeComplete", updateLinks);

    return () => {
      window.removeEventListener("routeChangeComplete", updateLinks);
    };
  }, []);
}
