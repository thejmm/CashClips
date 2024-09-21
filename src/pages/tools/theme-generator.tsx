// src/pages/tools/theme-generator.tsx
import ColorCustomizer, {
  initialDarkColors,
} from "@/components/landing/tools/color-panel";
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import AuthProtectedTool from "@/components/landing/auth/auth-protect";
import { Button } from "@/components/ui/button";
import ComponentsDisplay from "@/components/landing/tools/component-display";
import { NextPage } from "next";
import Safari from "@/components/ui/safari";
import { ScrollArea } from "@/components/ui/scroll-area";

const ThemeGenerator: NextPage = () => {
  const [colorVariables, setColorVariables] = useState(initialDarkColors);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <AuthProtectedTool>
      {/* Navigation Bar */}
      <div
        className={`w-full md:hidden flex z-50 justify-between items-center p-4`}
      >
        <h1 className="text-xl font-bold">Theme Generator</h1>

        {/* Sheet for Mobile */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden">
              Customize Theme
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="pb-0">
            <ScrollArea className="h-full">
              <ColorCustomizer
                colorVariables={colorVariables}
                setColorVariables={setColorVariables}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <div className={`mx-auto flex h-[90svh] ${darkMode ? "dark" : ""}`}>
        {/* Sidebar for Color Customizer (visible on larger screens) */}
        <div className="w-80 border-r border-b hidden lg:block">
          <ScrollArea className="h-full">
            <ColorCustomizer
              colorVariables={colorVariables}
              setColorVariables={setColorVariables}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          </ScrollArea>
        </div>

        {/* Components Display */}
        <div className="flex-grow border-b p-2 md:px-12">
          <Safari url="https://yourwebsitehere.url">
            <ScrollArea className="h-full">
              <ComponentsDisplay
                colorVariables={colorVariables}
                darkMode={darkMode}
              />
            </ScrollArea>
          </Safari>
        </div>
      </div>
    </AuthProtectedTool>
  );
};

export default ThemeGenerator;
