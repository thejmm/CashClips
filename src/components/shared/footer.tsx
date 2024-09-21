import { ChevronRightIcon } from "lucide-react";
import { DashboardIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { ThemeToggle } from "../ui/theme-toggle";

type FooterLink = { id: number; title: string; url: string };

const footerLinks: FooterLink[][] = [
  [
    { id: 1, title: "Drag-and-Drop Builder", url: "/editor" },
    { id: 2, title: "Template Library", url: "/editor/templates" },
  ],
  [
    { id: 3, title: "SEO Optimizer", url: "/tools/seo-optimizer" },
    { id: 4, title: "Meta Tag Generator", url: "/tools/meta-tag-generator" },
    {
      id: 5,
      title: "Accessibility Checker",
      url: "/tools/accessibility-checker",
    },
    { id: 6, title: "Theme Generator", url: "/tools/theme-generator" },
  ],
  [
    { id: 7, title: "FAQs", url: "/faqs" },
    { id: 8, title: "Contact", url: "/contact" },
    { id: 9, title: "Privacy Policy", url: "/privacy-policy" },
    { id: 10, title: "Terms of Service", url: "/terms-of-service" },
  ],
];

export function Footer() {
  return (
    <footer className="px-7 md:px-10">
      <div className="hidden md:flex flex-col items-center justify-center gap-y-3 border-b border-dashed border-slate-400/20 py-10 lg:flex-row lg:items-center lg:justify-between">
        <h3 className="max-w-md text-balance text-center text-2xl font-bold text-neutral-900 dark:text-white md:text-start md:text-4xl">
          Ready to start building?
        </h3>
        <div className="flex flex-col items-center justify-center gap-x-5 gap-y-2 py-4 sm:flex-row">
          <Link
            href="/editor"
            className="flex h-10 w-40 items-center justify-center rounded-full bg-neutral-800 text-base font-semibold text-white transition ease-out hover:ring-2 hover:ring-neutral-900 hover:ring-offset-2 dark:bg-white dark:text-black dark:hover:ring-white dark:hover:ring-offset-black lg:h-12 lg:text-base"
          >
            <span className="tracking-tight">Start Building</span>
            <ChevronRightIcon className="ml-2" />
          </Link>
          <Link
            href="/pricing"
            className="flex h-10 w-40 items-center justify-center rounded-full border text-sm font-semibold text-neutral-900 transition ease-out hover:bg-neutral-200/30 dark:text-white dark:hover:bg-neutral-700/30 lg:h-12 lg:text-base"
          >
            <span className="tracking-tight">View Pricing</span>
          </Link>
        </div>
      </div>
      <div className="flex flex-col py-10 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col items-start justify-start gap-y-5">
          <div className="flex flex-row gap-6">
            <Link href="/" className="flex items-center gap-x-2.5">
              <DashboardIcon className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
                BUILDFLOW
              </h1>
            </Link>
            <ThemeToggle />
          </div>
          <p className="tracking-tight text-neutral-900 dark:text-white">
            Build stunning websites with ease
          </p>
          <p className="text-sm tracking-tight text-neutral-500 dark:text-neutral-400">
            © {new Date().getFullYear()} BuildFlow. All rights reserved.
          </p>
        </div>
        <div className="max-sm:border-t max-sm:border-dashed max-sm:mt-4 pt-5 md:w-1/2">
          <div className="flex items-start justify-between gap-x-3 px-0 lg:px-10">
            {footerLinks.map((column, columnIndex) => (
              <ul key={columnIndex} className="flex flex-col gap-y-2">
                {column.map((link) => (
                  <li
                    key={link.id}
                    className="group inline-flex cursor-pointer items-center justify-start gap-1 text-[15px]/snug font-medium text-neutral-400 duration-200 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                  >
                    <Link href={link.url}>{link.title}</Link>
                    <ChevronRightIcon className="h-4 w-4 translate-x-0 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100" />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-0 relative w-full">
        <div className="w-full mx-auto">
          <p
            className="text-center font-bold leading-none"
            style={{ fontSize: "clamp(2rem, 14vw, 12rem)" }}
          >
            <span className="bg-gradient-to-t from-primary/40 to-transparent dark:from-primary/20 dark:to-transparent bg-clip-text text-transparent">
              BUILDFLOW
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
