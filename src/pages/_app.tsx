import "@/styles/globals.css";

import { useEffect, useRef } from "react";

import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import { Footer } from "@/components/layout/footer";
import Head from "next/head";
import Header from "@/components/layout/header";
import { ThemeProvider } from "@/context/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "ServiceWorker registration successful with scope: ",
            registration.scope,
          );
        })
        .catch((err) => {
          console.error("ServiceWorker registration failed: ", err);
        });
    }
  }, []);

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
      <Header user={pageProps.user} />
      <Component {...pageProps} />
      <Footer />
      <Toaster richColors />
      <Analytics />
    </ThemeProvider>
  );
}
