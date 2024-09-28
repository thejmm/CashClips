import { NextSeo } from "next-seo";
import Link from "next/link"; // Assuming you're using Next.js for routing
// src/pages/privacy-policy.tsx
import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <NextSeo
        title="Privacy Policy - CashClips"
        description="Read the CashClips Privacy Policy to learn how we handle your data, protect your privacy, and ensure your security."
        canonical="https://cashclips.io/privacy-policy"
        openGraph={{
          url: "https://cashclips.io/privacy-policy",
          title: "Privacy Policy - CashClips",
          description:
            "Learn how CashClips collects, uses, and protects your personal information in our Privacy Policy.",
          images: [
            {
              url: "https://cashclips.io/seo.png",
              width: 1200,
              height: 630,
              alt: "CashClips Privacy Policy",
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
            href: "https://cashclips.io/privacy-policy",
          },
        ]}
      />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 text-4xl font-bold">Privacy Policy</h1>

        <p className="mb-4">
          <strong>Last Updated:</strong> [Insert Date]
        </p>

        <h2 className="mb-4 text-2xl font-semibold">1. Introduction</h2>
        <p className="mb-4">
          Welcome to [Your Company Name] (&#34;<strong>Company</strong>&#34;,
          &#34;
          <strong>we</strong>&#34;, &#34;<strong>our</strong>&#34;, or &#34;
          <strong>us</strong>
          &#34;). This Privacy Policy explains how we collect, use, disclose,
          and safeguard your information when you visit our website
          [yourwebsite.com], including any other media form, media channel,
          mobile website, or mobile application related or connected thereto
          (collectively, the &#34;<strong>Site</strong>&#34;). Please read this
          privacy policy carefully. If you do not agree with the terms of this
          privacy policy, please do not access the site.
        </p>
        <p className="mb-4">
          We reserve the right to make changes to this Privacy Policy at any
          time and for any reason. We will alert you about any changes by
          updating the &#34;Last Updated&#34; date of this Privacy Policy. Any
          changes or modifications will be effective immediately upon posting
          the updated Privacy Policy on the Site, and you waive the right to
          receive specific notice of each such change or modification.
        </p>
        <p className="mb-4">
          You are encouraged to periodically review this Privacy Policy to stay
          informed of updates. You will be deemed to have been made aware of,
          will be subject to, and will be deemed to have accepted the changes in
          any revised Privacy Policy by your continued use of the Site after the
          date such revised Privacy Policy is posted.
        </p>

        <h2 className="mb-4 text-2xl font-semibold">
          2. Collection of Your Information
        </h2>
        <p className="mb-4">
          We may collect information about you in a variety of ways. The
          information we may collect on the Site includes:
        </p>

        <h3 className="mb-2 text-xl font-semibold">2.1 Personal Data</h3>
        <p className="mb-4">
          Personally identifiable information, such as your name, shipping
          address, email address, and telephone number, and demographic
          information, such as your age, gender, hometown, and interests that
          you voluntarily give to us when you register with the Site or when you
          choose to participate in various activities related to the Site, such
          as online chat and message boards. You are under no obligation to
          provide us with personal information of any kind; however, your
          refusal to do so may prevent you from using certain features of the
          Site.
        </p>

        <h3 className="mb-2 text-xl font-semibold">2.2 Financial Data</h3>
        <p className="mb-4">
          Financial information, such as data related to your payment method
          (e.g., valid credit card number, card brand, expiration date) that we
          may collect when you purchase, order, return, exchange, or request
          information about our services from the Site. We store only very
          limited, if any, financial information that we collect. Otherwise, all
          financial information is stored by our payment processor,{" "}
          <strong>Stripe</strong>, and you are encouraged to review their
          privacy policy and contact them directly for responses to your
          questions.
        </p>

        <h3 className="mb-2 text-xl font-semibold">
          2.3 Data From Social Networks
        </h3>
        <p className="mb-4">
          User information from social networking sites, such as [social media
          platforms you use], including your name, your social network username,
          location, gender, birth date, email address, profile picture, and
          public data for contacts, if you connect your account to such social
          networks.
        </p>

        <h3 className="mb-2 text-xl font-semibold">2.4 Mobile Device Data</h3>
        <p className="mb-4">
          Device information, such as your mobile device ID, model, and
          manufacturer, and information about the location of your device, if
          you access the Site from a mobile device.
        </p>

        <h3 className="mb-2 text-xl font-semibold">2.5 Third-Party Data</h3>
        <p className="mb-4">
          Information from third parties, such as personal information or
          network friends, if you connect your account to the third party and
          grant the Site permission to access this information.
        </p>

        <h3 className="mb-2 text-xl font-semibold">
          2.6 Data From Contests, Giveaways, and Surveys
        </h3>
        <p className="mb-4">
          Personal and other information you may provide when entering contests
          or giveaways and/or responding to surveys.
        </p>

        <h2 className="mb-4 text-2xl font-semibold">
          3. Use of Your Information
        </h2>
        <p className="mb-4">
          Having accurate information about you permits us to provide you with a
          smooth, efficient, and customized experience. Specifically, we may use
          information collected about you via the Site to:
        </p>
        <ul className="mb-4 list-disc pl-5">
          <li>Create and manage your account.</li>
          <li>Email you regarding your account or order.</li>
          <li>
            Fulfill and manage purchases, orders, payments, and other
            transactions related to the Site.
          </li>
          <li>
            Generate a personal profile about you to make future visits to the
            Site more personalized.
          </li>
          <li>Increase the efficiency and operation of the Site.</li>
          <li>
            Monitor and analyze usage and trends to improve your experience with
            the Site.
          </li>
          <li>Offer new products, services, and/or recommendations to you.</li>
          <li>Perform other business activities as needed.</li>
          <li>
            Prevent fraudulent transactions, monitor against theft, and protect
            against criminal activity.
          </li>
          <li>Request feedback and contact you about your use of the Site.</li>
          <li>Resolve disputes and troubleshoot problems.</li>
          <li>Respond to product and customer service requests.</li>
          <li>Send you a newsletter.</li>
          <li>Solicit support for the Site.</li>
        </ul>

        <h2 className="mb-4 text-2xl font-semibold">
          4. Disclosure of Your Information
        </h2>
        <p className="mb-4">
          We may share information we have collected about you in certain
          situations. Your information may be disclosed as follows:
        </p>

        <h3 className="mb-2 text-xl font-semibold">
          4.1 By Law or to Protect Rights
        </h3>
        <p className="mb-4">
          If we believe the release of information about you is necessary to
          respond to legal process, to investigate or remedy potential
          violations of our policies, or to protect the rights, property, and
          safety of others, we may share your information as permitted or
          required by any applicable law, rule, or regulation.
        </p>

        <h3 className="mb-2 text-xl font-semibold">
          4.2 Third-Party Service Providers
        </h3>
        <p className="mb-4">
          We may share your information with third parties that perform services
          for us or on our behalf, including payment processing, data analysis,
          email delivery, hosting services, customer service, and marketing
          assistance.
        </p>

        <h3 className="mb-2 text-xl font-semibold">
          4.3 Marketing Communications
        </h3>
        <p className="mb-4">
          With your consent, or with an opportunity for you to withdraw consent,
          we may share your information with third parties for marketing
          purposes, as permitted by law.
        </p>

        <h3 className="mb-2 text-xl font-semibold">
          4.4 Interactions with Other Users
        </h3>
        <p className="mb-4">
          If you interact with other users of the Site, those users may see your
          name, profile photo, and descriptions of your activity.
        </p>

        <h3 className="mb-2 text-xl font-semibold">4.5 Online Postings</h3>
        <p className="mb-4">
          When you post comments, contributions, or other content to the Site,
          your posts may be viewed by all users and may be publicly distributed
          outside the Site in perpetuity.
        </p>

        <h3 className="mb-2 text-xl font-semibold">
          4.6 Third-Party Advertisers
        </h3>
        <p className="mb-4">
          We may use third-party advertising companies to serve ads when you
          visit the Site. These companies may use information about your visits
          to the Site and other websites that are contained in web cookies to
          provide advertisements about goods and services of interest to you.
        </p>

        <h3 className="mb-2 text-xl font-semibold">4.7 Affiliates</h3>
        <p className="mb-4">
          We may share your information with our affiliates, in which case we
          will require those affiliates to honor this Privacy Policy.
        </p>

        <h3 className="mb-2 text-xl font-semibold">4.8 Business Partners</h3>
        <p className="mb-4">
          We may share your information with our business partners to offer you
          certain products, services, or promotions.
        </p>

        <h3 className="mb-2 text-xl font-semibold">4.9 Other Third Parties</h3>
        <p className="mb-4">
          We may share your information with advertisers and investors for the
          purpose of conducting general business analysis.
        </p>

        <h2 className="mb-4 text-2xl font-semibold">
          5. Tracking Technologies
        </h2>
        <h3 className="mb-2 text-xl font-semibold">
          5.1 Cookies and Web Beacons
        </h3>
        <p className="mb-4">
          We may use cookies, web beacons, tracking pixels, and other tracking
          technologies on the Site to help customize the Site and improve your
          experience. When you access the Site, your personal information is not
          collected through the use of tracking technology.
        </p>

        <h3 className="mb-2 text-xl font-semibold">
          5.2 Internet-Based Advertising
        </h3>
        <p className="mb-4">
          Additionally, we may use third-party software to serve ads on the
          Site, implement email marketing campaigns, and manage other
          interactive marketing initiatives.
        </p>

        <h2 className="mb-4 text-2xl font-semibold">6. Third-Party Websites</h2>
        <p className="mb-4">
          The Site may contain links to third-party websites and applications of
          interest, including advertisements and external services. We do not
          control these third-party websites and are not responsible for their
          privacy practices.
        </p>

        <h2 className="mb-4 text-2xl font-semibold">
          7. Security of Your Information
        </h2>
        <p className="mb-4">
          We use administrative, technical, and physical security measures to
          help protect your personal information. While we have taken reasonable
          steps to secure the personal information you provide to us, please be
          aware that despite our efforts, no security measures are perfect or
          impenetrable.
        </p>

        <h2 className="mb-4 text-2xl font-semibold">8. Policy for Children</h2>
        <p className="mb-4">
          We do not knowingly solicit information from or market to children
          under the age of 13. If you become aware of any data we have collected
          from children under age 13, please contact us using the contact
          information provided below.
        </p>

        <h2 className="mb-4 text-2xl font-semibold">
          9. Controls for Do-Not-Track Features
        </h2>
        <p className="mb-4">
          Most web browsers and some mobile operating systems include a
          Do-Not-Track (&#34;DNT&#34;) feature or setting you can activate to
          signal your privacy preference not to have data about your online
          browsing activities monitored and collected.
        </p>

        <h2 className="mb-4 text-2xl font-semibold">
          10. Options Regarding Your Information
        </h2>
        <p className="mb-4">
          <strong>Account Information</strong>
        </p>
        <p className="mb-4">
          You may at any time review or change the information in your account
          or terminate your account by:
        </p>
        <ul className="mb-4 list-disc pl-5">
          <li>Logging into your account settings and updating your account</li>
          <li>Contacting us using the contact information provided below</li>
        </ul>
        <p className="mb-4">
          Upon your request to terminate your account, we will deactivate or
          delete your account and information from our active databases.
        </p>

        <h2 className="mb-4 text-2xl font-semibold">
          11. California Privacy Rights
        </h2>
        <p className="mb-4">
          California Civil Code Section 1798.83 permits our users who are
          California residents to request certain information regarding our
          disclosure of personal information to third parties for their direct
          marketing purposes.
        </p>

        <h2 className="mb-4 text-2xl font-semibold">
          12. GDPR Data Protection Rights
        </h2>
        <p className="mb-4">
          We would like to make sure you are fully aware of all of your data
          protection rights under the General Data Protection Regulation (GDPR).
          Every user is entitled to the following:
        </p>
        <ul className="mb-4 list-disc pl-5">
          <li>The right to access</li>
          <li>The right to rectification</li>
          <li>The right to erasure</li>
          <li>The right to restrict processing</li>
          <li>The right to object to processing</li>
          <li>The right to data portability</li>
        </ul>

        <h2 className="mb-4 text-2xl font-semibold">
          13. International Data Transfers
        </h2>
        <p className="mb-4">
          Your information, including personal data, may be transferred to—and
          maintained on—computers located outside of your state, province,
          country, or other governmental jurisdiction where the data protection
          laws may differ from those of your jurisdiction.
        </p>

        <h2 className="mb-4 text-2xl font-semibold">
          14. Changes to This Privacy Policy
        </h2>
        <p className="mb-4">
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page.
        </p>

        <h2 className="mb-4 text-2xl font-semibold">15. Contact Us</h2>
        <p className="mb-4">
          If you have questions or comments about this Privacy Policy, please
          contact us at:
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

export default PrivacyPolicy;
