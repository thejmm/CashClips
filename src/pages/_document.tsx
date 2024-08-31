import { Head, Html, Main, NextScript } from "next/document";

import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.lemonSqueezyAffiliateConfig = { store: "voltic-stream" };
            `,
          }}
        />
        <Script
          src="https://lmsqueezy.com/affiliate.js"
          strategy="lazyOnload"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />

        <link rel="manifest" href="/manifest.json" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://voltic.stream" />
        <meta name="twitter:title" content="Voltic" />
        <meta
          name="twitter:description"
          content="The ultimate platform for streamers to manage clips, engage viewers, and grow their community."
        />
        <meta name="twitter:image" content="https://voltic.stream/logo.png" />
        <meta name="twitter:creator" content="@bankkroll_eth" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Voltic" />
        <meta
          property="og:description"
          content="The ultimate platform for streamers to manage clips, engage viewers, and grow their community."
        />
        <meta property="og:site_name" content="Voltic" />
        <meta property="og:url" content="https://voltic.stream" />
        <meta property="og:image" content="https://voltic.stream/logo.png" />
        {/* fix the following only if you want to add a startup image for Apple devices. */}
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_2048.png"
          sizes="2048x2732"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_1668.png"
          sizes="1668x2224"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_1536.png"
          sizes="1536x2048"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_1125.png"
          sizes="1125x2436"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_1242.png"
          sizes="1242x2208"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_750.png"
          sizes="750x1334"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_640.png"
          sizes="640x1136"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
