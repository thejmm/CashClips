// src/components/landing/sections/bento/responsive-templates.tsx

import { Layout, Smartphone, Tablet } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, useAnimation } from "framer-motion";

import Ipad from "@/components/ui/ipad";
import Iphone15Pro from "@/components/ui/iphone";
import Safari from "@/components/ui/safari";

const deviceDimensions = {
  desktop: { width: 1200, height: 750 },
  tablet: { width: 820, height: 1180 },
  mobile: { width: 430, height: 925 },
};

const ResponsiveTemplates: React.FC = () => {
  const [activeDevice, setActiveDevice] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const deviceDim = deviceDimensions[activeDevice];
        const scale = Math.min(
          (width * 0.9) / deviceDim.width,
          (height * 0.9) / deviceDim.height,
        );

        controls.start({
          scale,
          transition: { type: "spring", stiffness: 300, damping: 30 },
        });
      }
    };

    window.addEventListener("resize", updateSize);
    updateSize();

    return () => window.removeEventListener("resize", updateSize);
  }, [activeDevice, controls]);

  const renderDeviceFrame = (device: "desktop" | "tablet" | "mobile") => {
    const { width, height } = deviceDimensions[device];
    const placeholderUrl = `https://placehold.co/${width}x${height}/${
      device === "desktop" ? "eee" : "fff"
    }/${device === "desktop" ? "999" : "000"}?text=${
      device.charAt(0).toUpperCase() + device.slice(1)
    }+View`;

    switch (device) {
      case "desktop":
        return (
          <Safari
            src={placeholderUrl}
            width={width}
            height={height}
            url="https://example.com"
          />
        );
      case "tablet":
        return <Ipad src={placeholderUrl} width={width} height={height} />;
      case "mobile":
        return (
          <Iphone15Pro src={placeholderUrl} width={width} height={height} />
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-primary rounded-lg p-4">
      <Tabs
        defaultValue="desktop"
        onValueChange={(value) =>
          setActiveDevice(value as "desktop" | "tablet" | "mobile")
        }
      >
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="desktop" className="flex items-center gap-2">
            <Layout size={14} />
            <span className="hidden sm:inline">Desktop</span>
          </TabsTrigger>
          <TabsTrigger value="tablet" className="flex items-center gap-2">
            <Tablet size={14} />
            <span className="hidden sm:inline">Tablet</span>
          </TabsTrigger>
          <TabsTrigger value="mobile" className="flex items-center gap-2">
            <Smartphone size={14} />
            <span className="hidden sm:inline">Mobile</span>
          </TabsTrigger>
        </TabsList>

        <div
          ref={containerRef}
          className="flex-1 relative overflow-hidden overflow-y-hidden rounded-lg"
        >
          <TabsContent
            value="desktop"
            className="flex items-center justify-center"
          >
            <motion.div animate={controls} className="origin-top">
              {renderDeviceFrame("desktop")}
            </motion.div>
          </TabsContent>
          <TabsContent
            value="tablet"
            className="flex items-center justify-center"
          >
            <motion.div animate={controls} className="origin-top">
              {renderDeviceFrame("tablet")}
            </motion.div>
          </TabsContent>
          <TabsContent
            value="mobile"
            className="flex items-center justify-center"
          >
            <motion.div animate={controls} className="origin-top">
              {renderDeviceFrame("mobile")}
            </motion.div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ResponsiveTemplates;
