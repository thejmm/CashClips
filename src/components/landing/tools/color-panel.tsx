// src/components/landing/tools/color-panel.tsx

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { ChromePicker } from "react-color";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { toast } from "sonner";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

type ColorMode = "light" | "dark";
type ColorVariableKey = keyof typeof initialLightColors;

export const initialLightColors = {
  background: "0 0% 100%",
  foreground: "20 14.3% 4.1%",
  card: "0 0% 100%",
  "card-foreground": "20 14.3% 4.1%",
  popover: "0 0% 100%",
  "popover-foreground": "20 14.3% 4.1%",
  primary: "24 9.8% 10%",
  "primary-foreground": "60 9.1% 97.8%",
  secondary: "60 4.8% 95.9%",
  "secondary-foreground": "24 9.8% 10%",
  muted: "60 4.8% 95.9%",
  "muted-foreground": "25 5.3% 44.7%",
  accent: "60 4.8% 95.9%",
  "accent-foreground": "24 9.8% 10%",
  destructive: "0 84.2% 60.2%",
  "destructive-foreground": "60 9.1% 97.8%",
  border: "20 5.9% 90%",
  input: "20 5.9% 90%",
  ring: "20 14.3% 4.1%",
  radius: "0.5rem",
  "chart-1": "12 76% 61%",
  "chart-2": "173 58% 39%",
  "chart-3": "197 37% 24%",
  "chart-4": "43 74% 66%",
  "chart-5": "27 87% 67%",
};

export const initialDarkColors = {
  background: "20 14.3% 4.1%",
  foreground: "60 9.1% 97.8%",
  card: "20 14.3% 4.1%",
  "card-foreground": "60 9.1% 97.8%",
  popover: "20 14.3% 4.1%",
  "popover-foreground": "60 9.1% 97.8%",
  primary: "60 9.1% 97.8%",
  "primary-foreground": "24 9.8% 10%",
  secondary: "12 6.5% 15.1%",
  "secondary-foreground": "60 9.1% 97.8%",
  muted: "12 6.5% 15.1%",
  "muted-foreground": "24 5.4% 63.9%",
  accent: "12 6.5% 15.1%",
  "accent-foreground": "60 9.1% 97.8%",
  destructive: "0 62.8% 30.6%",
  "destructive-foreground": "60 9.1% 97.8%",
  border: "12 6.5% 15.1%",
  input: "12 6.5% 15.1%",
  ring: "24 5.7% 82.9%",
  radius: "0.5rem",
  "chart-1": "220 70% 50%",
  "chart-2": "160 60% 45%",
  "chart-3": "30 80% 55%",
  "chart-4": "280 65% 60%",
  "chart-5": "340 75% 55%",
};

interface ColorCustomizerProps {
  colorVariables: typeof initialLightColors;
  setColorVariables: React.Dispatch<
    React.SetStateAction<typeof initialLightColors>
  >;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const ColorCustomizer: React.FC<ColorCustomizerProps> = ({
  colorVariables,
  setColorVariables,
  darkMode,
  setDarkMode,
}) => {
  const [lightColors, setLightColors] = useState(initialLightColors);
  const [darkColors, setDarkColors] = useState(initialDarkColors);
  const [currentMode, setCurrentMode] = useState<ColorMode>(
    darkMode ? "dark" : "light",
  );

  useEffect(() => {
    setColorVariables(currentMode === "dark" ? darkColors : lightColors);
    setDarkMode(currentMode === "dark");
  }, [currentMode, lightColors, darkColors, setColorVariables, setDarkMode]);

  const handleColorChange = (
    variable: ColorVariableKey,
    color: string,
    mode: ColorMode,
  ) => {
    const newColor = `${color}`;
    if (mode === "light") {
      setLightColors((prev) => ({ ...prev, [variable]: newColor }));
    } else {
      setDarkColors((prev) => ({ ...prev, [variable]: newColor }));
    }
  };

  const generateCSSVariables = () => {
    const lightTheme = Object.entries(lightColors)
      .map(([key, value]) => `  --${key}: ${value};`)
      .join("\n");
    const darkTheme = Object.entries(darkColors)
      .map(([key, value]) => `    --${key}: ${value};`)
      .join("\n");

    return `@layer base {
  :root {
${lightTheme}
  }
  .dark {
${darkTheme}
  }
}`;
  };

  const ColorButton = ({
    variable,
    color,
    mode,
    handleColorChange,
  }: {
    variable: ColorVariableKey;
    color: string;
    mode: ColorMode;
    handleColorChange: (
      variable: ColorVariableKey,
      color: string,
      mode: ColorMode,
    ) => void;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          popoverRef.current &&
          !popoverRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {variable.replace("-", " ")}
            <div
              className="w-6 h-6 rounded-full border"
              style={{
                backgroundColor: `hsl(${color})`,
                color: mode === "light" ? "black" : "white",
              }}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" ref={popoverRef}>
          <div onClick={(e) => e.stopPropagation()}>
            <ChromePicker
              color={`hsl(${color})`}
              onChange={(newColor) => {
                const { h, s, l } = newColor.hsl;
                handleColorChange(
                  variable,
                  `${h.toFixed(1)} ${(s * 100).toFixed(1)}% ${(l * 100).toFixed(
                    1,
                  )}%`,
                  mode,
                );
              }}
              disableAlpha={true}
            />
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Theme</h1>
        <Select
          value={currentMode}
          onValueChange={(value: ColorMode) => setCurrentMode(value)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light Mode</SelectItem>
            <SelectItem value="dark">Dark Mode</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Separator />
      <ScrollArea className="h-[70svh]">
        <div className="space-y-4">
          {Object.entries(
            currentMode === "light" ? lightColors : darkColors,
          ).map(([variable, color]) => (
            <ColorButton
              key={variable}
              variable={variable as ColorVariableKey}
              color={color}
              mode={currentMode}
              handleColorChange={handleColorChange}
            />
          ))}
        </div>
      </ScrollArea>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full">Export CSS Variables</Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Generated CSS Variables</DialogTitle>
          </DialogHeader>
          <Separator />
          <ScrollArea className="h-[30rem] w-full mt-4">
            <SyntaxHighlighter
              language="css"
              style={vscDarkPlus}
              showLineNumbers
              wrapLines
              className="rounded-md"
            >
              {generateCSSVariables()}
            </SyntaxHighlighter>
          </ScrollArea>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(generateCSSVariables());
              toast("Copied to clipboard!");
            }}
            className="mt-4 w-full"
          >
            Copy CSS
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ColorCustomizer;
