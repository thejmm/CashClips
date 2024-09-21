import "@/styles/globals.css";

import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import BlurHeader from "@/components/shared/header";
import { Feedback } from "@/components/shared/feedback";
import { Footer } from "@/components/shared/footer";
import { ThemeProvider } from "@/context/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const showHeaderFooter = router.pathname !== "/editor/project/[id]";

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {showHeaderFooter && <BlurHeader />}
      <Component {...pageProps} />
      {showHeaderFooter && <Footer />}
      <Feedback />
      <Toaster richColors />
      <Analytics />
    </ThemeProvider>
  );
}
