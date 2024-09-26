// src/components/docs/docs-layout.tsx
import { DollarSign, HelpCircle, Layout, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/router";

const sidebar = [
  { name: "Introduction", href: "/docs", icon: HelpCircle },
  { name: "Getting Started", href: "/docs/getting-started", icon: Layout },
  { name: "Affiliate", href: "/docs/affiliate", icon: DollarSign },
];

const DocsLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();

  const NavLinks = () => (
    <>
      {sidebar.map((item) => (
        <>
          <Link key={item.name} href={item.href} passHref>
            <Button
              variant="outlineRingHover"
              className={`group mb-2 w-full justify-start transition-all duration-300 ease-out ${
                router.pathname === item.href
                  ? "bg-accent ring-2 ring-primary/90 ring-offset-2"
                  : ""
              }`}
            >
              <item.icon className="mr-2 h-4 w-4 transition-all duration-300 ease-out group-hover:-translate-x-1" />
              {item.name}
            </Button>
          </Link>
        </>
      ))}
    </>
  );

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="w-full border-r md:min-h-screen md:w-64">
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between md:block">
            <h2 className="mb-6 text-2xl font-bold">Docs</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon">
                  <Menu className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <NavLinks />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <nav className="hidden md:block">
            <ul className="space-y-2">
              <NavLinks />
            </ul>
          </nav>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>
    </div>
  );
};

export default DocsLayout;
