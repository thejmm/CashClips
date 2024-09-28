// src/pages/terms-of-service-affiliate.tsx
import { NextSeo } from "next-seo";
import React from "react";

const TermsOfServiceAffiliate: React.FC = () => {
  return (
    <>
      <NextSeo
        title="Affiliate Terms of Service - CashClips"
        description="Review the affiliate terms for CashClips. Understand your rights, commissions, and responsibilities as an affiliate partner."
        canonical="https://cashclips.io/terms-of-service-affiliate"
        openGraph={{
          url: "https://cashclips.io/terms-of-service-affiliate",
          title: "Affiliate Terms of Service - CashClips",
          description:
            "Learn about the CashClips affiliate program, including rules, commissions, and responsibilities.",
          images: [
            {
              url: "https://cashclips.io/seo.svg",
              width: 1200,
              height: 630,
              alt: "CashClips Affiliate Terms of Service",
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
            href: "https://cashclips.io/terms-of-service-affiliate",
          },
        ]}
      />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 text-4xl font-bold">
          Affiliate Terms and Conditions
        </h1>

        <p className="mb-4">**Last Updated:** [Insert Date]</p>

        <h2 className="mb-4 text-2xl font-semibold">1. Introduction</h2>
        <p className="mb-4">
          These Affiliate Terms and Conditions (&#34;Terms&#34;) govern the
          participation in our Affiliate Program (&#34;Program&#34;). By signing
          up as an affiliate, you agree to comply with these Terms.
        </p>

        <h2 className="mb-4 text-2xl font-semibold">
          2. Enrollment in the Program
        </h2>
        <p className="mb-4">
          To enroll, you must complete the registration form and provide
          accurate information. We reserve the right to accept or reject any
          application at our sole discretion.
        </p>

        <h2 className="mb-4 text-2xl font-semibold">
          3. Affiliate Responsibilities
        </h2>
        <p className="mb-4">As an affiliate, you agree to:</p>
        <ul className="mb-4 list-disc pl-5">
          <li>Promote our services in a lawful and ethical manner</li>
          <li>
            Use provided affiliate links correctly to ensure tracking and
            commission allocation
          </li>
          <li>Not engage in misleading or fraudulent activities</li>
        </ul>

        <h2 className="mb-4 text-2xl font-semibold">
          4. Commissions and Payments
        </h2>
        <p className="mb-4">
          Commissions are earned on qualifying purchases made through your
          affiliate links. The commission structure is as follows:
        </p>
        <ul className="mb-4 list-disc pl-5">
          <li>Percentage of sale: [Insert Commission Percentage]%</li>
          <li>
            Payment schedule: Commissions are paid [Insert Payment Frequency]
          </li>
          <li>Minimum payout threshold: [Insert Minimum Amount]</li>
        </ul>

        <h2 className="mb-4 text-2xl font-semibold">5. Term and Termination</h2>
        <p className="mb-4">
          These Terms begin upon your acceptance into the Program and continue
          until terminated by either party. We may terminate your participation
          at any time for any reason.
        </p>

        <h2 className="mb-4 text-2xl font-semibold">
          6. Intellectual Property
        </h2>
        <p className="mb-4">
          You are granted a non-exclusive, non-transferable license to use our
          trademarks and promotional materials solely for the purpose of
          promoting our services.
        </p>

        <h2 className="mb-4 text-2xl font-semibold">7. Compliance with Laws</h2>
        <p className="mb-4">
          You agree to comply with all applicable laws, including anti-spam
          regulations and advertising standards.
        </p>

        <h2 className="mb-4 text-2xl font-semibold">
          8. Limitation of Liability
        </h2>
        <p className="mb-4">
          We will not be liable for indirect, special, or consequential damages
          arising in connection with this Program.
        </p>

        <h2 className="mb-4 text-2xl font-semibold">9. Modifications</h2>
        <p className="mb-4">
          We may modify any of the terms and conditions within these Terms at
          any time. You will be notified of any changes, and your continued
          participation in the Program constitutes acceptance.
        </p>

        <h2 className="mb-4 text-2xl font-semibold">10. Governing Law</h2>
        <p className="mb-4">
          These Terms are governed by and construed in accordance with the laws
          of [Your Jurisdiction].
        </p>

        <h2 className="mb-4 text-2xl font-semibold">11. Contact Us</h2>
        <p className="mb-4">
          For any questions regarding these Terms, please contact us at [Your
          Contact Information].
        </p>
      </div>
    </>
  );
};

export default TermsOfServiceAffiliate;
