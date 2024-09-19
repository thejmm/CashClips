import { Head, Html, Main, NextScript } from "next/document";

import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content="#000000" />
      </Head>
      <Script
        src="https://cdn.promotekit.com/promotekit.js"
        data-promotekit="a1ede120-2bf6-4afa-9c88-f9bf10ebbd46"
        strategy="afterInteractive"
      />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
