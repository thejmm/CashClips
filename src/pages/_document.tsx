import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content="#000000" />
        <script
          async
          src="https://cdn.promotekit.com/promotekit.js"
          data-promotekit="a1ede120-2bf6-4afa-9c88-f9bf10ebbd46"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
