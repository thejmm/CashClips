"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoonIcon, SunIcon, LaptopIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = React.useState(theme);

  React.useEffect(() => {
    setSelectedTheme(theme);
  }, [theme]);

  const iconVariants = {
    initial: { opacity: 0, scale: 0.8, rotate: -30 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
    exit: { opacity: 0, scale: 0.8, rotate: 30 },
  };

  const renderIcon = (theme: string | undefined) => {
    switch (theme) {
      case "light":
        return <SunIcon className="h-[1.2rem] w-[1.2rem]" />;
      case "dark":
        return <MoonIcon className="h-[1.2rem] w-[1.2rem]" />;
      case "system":
        return <LaptopIcon className="h-[1.2rem] w-[1.2rem]" />;
      default:
        return <MoonIcon className="h-[1.2rem] w-[1.2rem]" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={selectedTheme}
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "spring", stiffness: 500, damping: 25 }} // Faster animation
              className="absolute flex items-center justify-center"
            >
              {renderIcon(selectedTheme)}
            </motion.div>
          </AnimatePresence>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 p-1">
        {/* Light Theme Option */}
        <DropdownMenuItem
          onClick={() => {
            setTheme("light");
            setSelectedTheme("light");
          }}
          className="flex items-center space-x-2"
        >
          <SunIcon className="h-4 w-4" />
          <span className="text-sm">Light</span>
        </DropdownMenuItem>

        {/* Dark Theme Option */}
        <DropdownMenuItem
          onClick={() => {
            setTheme("dark");
            setSelectedTheme("dark");
          }}
          className="flex items-center space-x-2"
        >
          <MoonIcon className="h-4 w-4" />
          <span className="text-sm">Dark</span>
        </DropdownMenuItem>

        {/* System Theme Option */}
        <DropdownMenuItem
          onClick={() => {
            setTheme("system");
            setSelectedTheme("system");
          }}
          className="flex items-center space-x-2"
        >
          <LaptopIcon className="h-4 w-4" />
          <span className="text-sm">System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
