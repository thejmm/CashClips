// src/pages/_app.tsx
import "@/styles/globals.css";

import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import { DefaultSeo } from "next-seo";
import { Footer } from "@/components/layout/footer";
import Head from "next/head";
import Header from "@/components/layout/header"; // Updated Header import
import Script from "next/script";
import { ThemeProvider } from "@/context/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import defaultSEO from "../../seo.config";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isUserLayout = router.pathname.includes("/user");

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <DefaultSeo {...defaultSEO} />
      <Script
        src="https://cdn.promotekit.com/promotekit.js"
        data-promotekit="a1ede120-2bf6-4afa-9c88-f9bf10ebbd46"
        strategy="afterInteractive"
      />
      {/* Conditionally render sticky header only on home page */}
      <Header user={pageProps.user} sticky={!isUserLayout} />
      <Component {...pageProps} />
      <Footer />
      <Toaster richColors />
      <Analytics />
    </ThemeProvider>
  );
}
