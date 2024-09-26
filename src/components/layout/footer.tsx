import {
  ChevronRightIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import {
  RiDiscordFill,
  RiInstagramFill,
  RiKickFill,
  RiTiktokFill,
  RiTwitchFill,
  RiTwitterXFill,
} from "react-icons/ri";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeToggle } from "../ui/theme-toggle";

const footerNavs = [
  {
    label: "Product",
    items: [
      {
        href: "/#features",
        name: "Features",
      },
      {
        href: "/#how-it-works",
        name: "How it works",
      },
      {
        href: "/contact/#faqs",
        name: "FAQ",
      },
      {
        href: "/pricing",
        name: "Pricing",
      },
    ],
  },
  {
    label: "Company",
    items: [
      {
        href: "/contact",
        name: "Contact",
      },
      {
        href: "/privacy-policy",
        name: "Privacy Policy",
      },
      {
        href: "/terms-of-service",
        name: "Terms of Service",
      },
    ],
  },
  {
    label: "Resources",
    items: [
      {
        href: "/docs",
        name: "Documentation",
      },
      {
        href: "#",
        name: "Community",
      },
      {
        href: "https://cashclips.promotekit.com",
        name: "Affiliates",
      },
    ],
  },
];

const footerSocials = [
  {
    href: "#",
    name: "X/Twitter",
    icon: <RiTwitterXFill className="size-5" />,
  },
  {
    href: "#",
    name: "Instagram",
    icon: <RiInstagramFill className="size-5" />,
  },
  {
    href: "#",
    name: "TikTok",
    icon: <RiTiktokFill className="size-5" />,
  },
  {
    href: "#",
    name: "Discord",
    icon: <RiDiscordFill className="size-5" />,
  },
];

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto w-full max-w-screen-xl px-4">
        <div className="gap-4 p-4 py-16 sm:pb-16 md:flex md:justify-between">
          <div className="mb-12 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <img
                className="h-12 w-12 rounded-lg"
                src="/logo.png"
                alt="Logo"
              />
              <span className="self-center whitespace-nowrap text-2xl font-semibold text-neutral-900 dark:text-white">
                CashClips
              </span>
            </Link>
            <div className="max-w-sm">
              <div className="z-10 mt-4 flex w-full flex-col items-start text-left">
                <h1 className="text-3xl font-bold lg:text-2xl">
                  Get started today.
                </h1>
                <p className="mt-2">
                  We&apos;re happy to help you get started with CashClips.
                </p>
                <Link href="/login" passHref className="w-full">
                  <Button
                    variant="ringHover"
                    className="group my-4 w-full rounded-full"
                  >
                    Get Started Today
                    <ChevronRightIcon className="ml-1 size-4 transition-all duration-300 ease-out group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
              <div>
                <ThemeToggle />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {footerNavs.map((nav) => (
              <div key={nav.label}>
                <h2 className="mb-6 text-sm font-semibold uppercase text-neutral-900 dark:text-white">
                  {nav.label}
                </h2>
                <ul className="grid gap-2">
                  {nav.items.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="group inline-flex cursor-pointer items-center justify-start gap-1 text-[15px]/snug font-medium text-neutral-400 duration-200 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                      >
                        <Button variant="linkHover2">
                          {item.name}
                          <ChevronRightIcon className="h-4 w-4 translate-x-0 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100" />
                        </Button>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t py-4 sm:flex sm:flex-row sm:items-center sm:justify-between">
          <div className="flex space-x-5 sm:mt-0 sm:justify-center">
            {footerSocials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="fill-neutral-500 text-neutral-500 hover:fill-neutral-900 hover:text-neutral-900 dark:hover:fill-neutral-600 dark:hover:text-neutral-600"
              >
                {social.icon}
                <span className="sr-only">{social.name}</span>
              </a>
            ))}
          </div>
          <span className="text-sm tracking-tight text-neutral-500 dark:text-neutral-400 sm:text-center">
            Copyright © {new Date().getFullYear()}{" "}
            <Link href="/" className="cursor-pointer">
              CashClips
            </Link>
            . All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
