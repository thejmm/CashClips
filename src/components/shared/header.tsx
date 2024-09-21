// src/components/shared/header.tsx
"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { DashboardIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { FaTools } from "react-icons/fa";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/component";
import { useRouter } from "next/router";

const headerLinks = [
  {
    trigger: "Features",
    content: {
      main: {
        icon: <DashboardIcon />,
        title: "Drag-and-Drop Builder",
        description:
          "View and create your stunning websites with our intuitive builder.",
        href: "/editor",
      },
      items: [
        {
          href: "/editor/templates",
          title: "Template Library",
          description: "Start with professionally designed templates.",
        },
      ],
    },
  },
  {
    trigger: "Free Tools",
    content: {
      main: {
        icon: <FaTools />,
        title: "Free Web Tools",
        description: "Use all these tools for free with an account!",
        href: "/tools",
      },
      items: [
        {
          title: "SEO Optimizer",
          href: "/tools/seo-optimizer",
          description: "Analyze and enhance your site's SEO performance.",
        },
        {
          title: "Meta Tag Generator",
          href: "/tools/meta-tag-generator",
          description: "Generate meta tags for better search engine results.",
        },
        {
          title: "Accessibility Checker",
          href: "/tools/accessibility-checker",
          description: "Identify and fix accessibility issues on your site.",
        },
        {
          title: "Theme Generator",
          href: "/tools/theme-generator",
          description: "Create and customize color themes for your site.",
        },
      ],
    },
  },
  {
    href: "/pricing",
    label: "Pricing",
  },
];

export default function Header() {
  const [addBorder, setAddBorder] = useState(false);
  const [addBackground, setAddBackground] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setAddBorder(scrolled);
      setAddBackground(scrolled);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Set up authentication listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const AuthButtons = () =>
    user ? (
      <>
        <Link href="/user" onClick={() => setIsOpen(false)}>
          <Button variant="outline" className="w-full">
            Account
          </Button>
        </Link>
        <Button variant="default" className="w-full" onClick={handleSignOut}>
          Sign Out
        </Button>
      </>
    ) : (
      <>
        <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
          <Button variant="outline" className="w-full">
            Sign In
          </Button>
        </Link>
        <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
          <Button variant="default" className="w-full">
            Sign Up
          </Button>
        </Link>
      </>
    );

  return (
    <header
      className={cn(
        "relative sticky flex justify-center top-0 z-50 py-4 transition-all",
        addBackground ? "bg-background/20 backdrop-blur" : "",
      )}
    >
      <div className="px-4 md:px-0 flex justify-between items-center container">
        <Link
          href="/"
          title="brand-logo"
          className="relative mr-6 flex items-center space-x-2"
        >
          <DashboardIcon className="h-6 w-6" />
          <span className="font-bold text-xl">BuildFlow</span>
        </Link>

        <div className="hidden lg:flex items-center space-x-4">
          <NavigationMenu>
            <NavigationMenuList>
              {headerLinks.map((link, index) => (
                <NavigationMenuItem key={index}>
                  {link.trigger ? (
                    <>
                      <NavigationMenuTrigger className="bg-transparent hover:bg-accent/50 transition-all">
                        {link.trigger}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] grid-cols-2">
                          {link.content.main && (
                            <li className="col-span-2 row-span-2">
                              <NavigationMenuLink asChild>
                                <Link
                                  className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/20 to-muted/50 hover:bg-accent/50 p-6 no-underline outline-none focus:shadow-md"
                                  href={link.content.main.href}
                                >
                                  {link.content.main.icon}
                                  <div className="mb-2 mt-4 text-lg font-medium">
                                    {link.content.main.title}
                                  </div>
                                  <p className="text-sm leading-tight text-muted-foreground">
                                    {link.content.main.description}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          )}
                          {link.content.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              <NavigationMenuLink asChild>
                                <Link
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                  href={item.href}
                                >
                                  <div className="text-sm font-medium leading-none">
                                    {item.title}
                                  </div>
                                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                    {item.description}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link
                      href={link.href || "#"}
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "px-4 bg-transparent hover:bg-accent/50 transition-all",
                      )}
                    >
                      {link.label}
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="pl-10 flex items-center space-x-2">
            <AuthButtons />
          </div>
        </div>

        <div className="lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <HamburgerMenuIcon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4">
                {headerLinks.map((link, index) => (
                  <React.Fragment key={index}>
                    {link.trigger ? (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          {link.trigger}
                        </h3>
                        {link.content.main && (
                          <Link
                            href={link.content.main.href}
                            onClick={() => setIsOpen(false)}
                          >
                            <Button
                              variant="linkHover2"
                              className="w-full justify-start text-sm"
                            >
                              {link.content.main.title}
                            </Button>
                          </Link>
                        )}
                        <div className="flex flex-col space-y-2 mt-2">
                          {link.content.items.map((item, itemIndex) => (
                            <Link
                              key={itemIndex}
                              href={item.href}
                              onClick={() => setIsOpen(false)}
                            >
                              <Button
                                variant="linkHover2"
                                className="w-full justify-start text-sm"
                              >
                                {item.title}
                              </Button>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={link.href || "#"}
                        onClick={() => setIsOpen(false)}
                      >
                        <Button
                          variant="linkHover2"
                          className="w-full justify-start"
                        >
                          {link.label}
                        </Button>
                      </Link>
                    )}
                    {index < headerLinks.length - 1 && <hr className="my-2" />}
                  </React.Fragment>
                ))}
                <hr className="my-4" />
                <AuthButtons />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <hr
        className={cn(
          "absolute w-full bottom-0 transition-opacity duration-300 ease-in-out",
          addBorder ? "opacity-100" : "opacity-0",
        )}
      />
    </header>
  );
}
