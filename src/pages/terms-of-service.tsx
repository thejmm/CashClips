import Link from "next/link";
import { NextSeo } from "next-seo";
import React from "react";

const TermsOfService: React.FC = () => {
  return (
    <>
      <NextSeo
        title="Terms of Service - CashClips"
        description="Review the terms and conditions for using CashClips. Understand your rights and responsibilities as a user."
        canonical="https://cashclips.io/terms-of-service"
        openGraph={{
          url: "https://cashclips.io/terms-of-service",
          title: "Terms of Service - CashClips",
          description:
            "Read the CashClips Terms of Service to understand the rules and regulations for using our platform.",
          images: [
            {
              url: "https://cashclips.io/seo.svg",
              width: 1200,
              height: 630,
              alt: "CashClips Terms of Service",
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
            href: "https://cashclips.io/terms-of-service",
          },
        ]}
      />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 text-4xl font-bold">Terms of Service</h1>

        <p className="mb-4">
          <strong>Last Updated:</strong> [Insert Date]
        </p>

        <h2 className="mb-4 text-2xl font-semibold">1. Introduction</h2>
        <p className="mb-4">
          Welcome to Cashclips (&#34;<strong>Company</strong>&#34;, &#34;
          <strong>we</strong>
          &#34;, &#34;<strong>our</strong>&#34;, or &#34;<strong>us</strong>
          &#34;). These Terms of Service (&#34;<strong>Terms</strong>&#34;)
          govern your access to and use of the Cashclips website, mobile
          application, and services (collectively, the &#34;
          <strong>Service</strong>&#34;). Please read these Terms carefully, and
          contact us if you have any questions.
        </p>
        <p className="mb-4">
          By accessing or using our Service, you agree to be bound by these
          Terms. If you disagree with any part of the terms, then you may not
          access the Service.
        </p>

        <h2 className="mb-4 text-2xl font-semibold">2. Use of Service</h2>
        <p className="mb-4">
          Our Service allows you to [describe main features of your service].
          You are responsible for maintaining the confidentiality of your
          account and password and for restricting access to your account.
        </p>

        <h2 className="mb-4 text-2xl font-semibold">3. User Content</h2>
        <p className="mb-4">
          Our Service allows you to post, link, store, share and otherwise make
          available certain information, text, graphics, videos, or other
          material (&#34;<strong>Content</strong>&#34;). You are responsible for
          the Content that you post on or through the Service, including its
          legality, reliability, and appropriateness.
        </p>

        <h2 className="mb-4 text-2xl font-semibold">
          4. Intellectual Property
        </h2>
        <p className="mb-4">
          The Service and its original content (excluding Content provided by
          users), features, and functionality are and will remain the exclusive
          property of Cashclips and its licensors. The Service is protected by
          copyright, trademark, and other laws of both the United States and
          foreign countries.
        </p>

        <h2 className="mb-4 text-2xl font-semibold">5. Termination</h2>
        <p className="mb-4">
          We may terminate or suspend your account immediately, without prior
          notice or liability, for any reason whatsoever, including without
          limitation if you breach the Terms. Upon termination, your right to
          use the Service will immediately cease.
        </p>

        <h2 className="mb-4 text-2xl font-semibold">
          6. Limitation of Liability
        </h2>
        <p className="mb-4">
          In no event shall Cashclips, nor its directors, employees, partners,
          agents, suppliers, or affiliates, be liable for any indirect,
          incidental, special, consequential or punitive damages, including
          without limitation, loss of profits, data, use, goodwill, or other
          intangible losses, resulting from your access to or use of or
          inability to access or use the Service.
        </p>

        <h2 className="mb-4 text-2xl font-semibold">7. Governing Law</h2>
        <p className="mb-4">
          These Terms shall be governed and construed in accordance with the
          laws of [Your State/Country], without regard to its conflict of law
          provisions.
        </p>

        <h2 className="mb-4 text-2xl font-semibold">8. Changes to Terms</h2>
        <p className="mb-4">
          We reserve the right, at our sole discretion, to modify or replace
          these Terms at any time. What constitutes a material change will be
          determined at our sole discretion. By continuing to access or use our
          Service after those revisions become effective, you agree to be bound
          by the revised terms.
        </p>

        <h2 className="mb-4 text-2xl font-semibold">9. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about these Terms, please contact us at:
        </p>
        <p className="mb-4">
          Email:{" "}
          <a href="mailto:contact@email.cashclips.io">
            contact@email.cashclips.io
          </a>
        </p>

        <p className="mb-4">
          Alternatively, you can reach us through our{" "}
          <Link href="/contact" className="text-blue-500">
            Contact Page
          </Link>
          .
        </p>
      </div>
    </>
  );
};

export default TermsOfService;
