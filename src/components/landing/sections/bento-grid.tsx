// src/components/landing/sections/bento-grid.tsx
"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

import DragAndDropEditor from "./bento/drag-and-drop";
import FlickeringGrid from "@/components/ui/flickering-grid";
import MetatagsGenerator from "./bento/metatags-generator";
import ResponsiveTemplates from "./bento/responsive-templates";
import SEOOptimization from "./bento/seo-optimization";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Drag-and-Drop Editor",
    description:
      "Create stunning websites effortlessly with our intuitive drag-and-drop interface. No coding skills required.",
    className: "hover:bg-blue-500/10 transition-all duration-500 ease-out",
    content: (
      <>
        <FlickeringGrid
          className="z-0 absolute inset-0 [mask:radial-gradient(circle_at_center,#fff_400px,transparent_0)]"
          squareSize={4}
          gridGap={6}
          color="#000"
          maxOpacity={0.1}
          flickerChance={0.1}
          height={800}
          width={800}
        />
        <DragAndDropEditor />
      </>
    ),
  },
  {
    title: "Responsive Templates",
    description:
      "Choose from hundreds of professionally designed templates that look great on all devices.",
    className:
      "order-3 xl:order-none hover:bg-purple-500/10 transition-all duration-500 ease-out",
    content: (
      <>
        <FlickeringGrid
          className="z-0 absolute inset-0 [mask:radial-gradient(circle_at_center,#fff_400px,transparent_0)]"
          squareSize={4}
          gridGap={6}
          color="#000"
          maxOpacity={0.1}
          flickerChance={0.1}
          height={800}
          width={800}
        />
        <ResponsiveTemplates />
      </>
    ),
  },
  {
    title: "SEO Optimization",
    description:
      "Boost your website's visibility with built-in SEO tools and best practices.",
    className:
      "md:row-span-2 hover:bg-green-500/10 transition-all duration-500 ease-out",
    content: (
      <>
        <FlickeringGrid
          className="z-0 absolute inset-0 [mask:radial-gradient(circle_at_center,#fff_400px,transparent_0)]"
          squareSize={4}
          gridGap={6}
          color="#000"
          maxOpacity={0.1}
          flickerChance={0.1}
          height={800}
          width={800}
        />
        <SEOOptimization />
      </>
    ),
  },
  {
    title: "Metatags Generator",
    description: "View and generate your site metatags.",
    className:
      "flex-row order-4 md:col-span-2 md:flex-row xl:order-none hover:bg-orange-500/10 transition-all duration-500 ease-out",
    content: (
      <>
        <FlickeringGrid
          className="z-0 absolute inset-0 [mask:radial-gradient(circle_at_center,#fff_400px,transparent_0)]"
          squareSize={4}
          gridGap={6}
          color="#000"
          maxOpacity={0.1}
          flickerChance={0.1}
          height={800}
          width={800}
        />
        <MetatagsGenerator />
      </>
    ),
  },
];

export default function WebsiteBuilderFeatures() {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.1,
  });

  return (
    <div className="py-16 px-4 justify-center mx-auto" ref={ref}>
      <div className="max-w-6xl justify-center mx-auto">
        <motion.h2
          className="text-3xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Build Your Dream Website
        </motion.h2>
        <motion.p
          className="text-xl text-center text-gray-600 dark:text-gray-300 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Create professional websites with ease using our powerful website
          builder.
        </motion.p>
        <div className="grid max-w-sm grid-cols-1 gap-6 text-gray-500 md:max-w-3xl md:grid-cols-2 xl:grid-rows-2 md:grid-rows-3 xl:max-w-6xl xl:auto-rows-fr xl:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={cn(
                "group relative items-start overflow-hidden bg-neutral-50 dark:bg-neutral-800 p-6 rounded-2xl",
                feature.className,
              )}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{
                duration: 0.5,
                type: "spring",
                stiffness: 100,
                damping: 30,
                delay: index * 0.1,
              }}
            >
              <div>
                <h3 className="font-semibold mb-2 text-primary">
                  {feature.title}
                </h3>
                <p className="text-foreground">{feature.description}</p>
              </div>
              <div className="mt-4 h-64">{feature.content}</div>
              <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-neutral-50 dark:from-neutral-900 pointer-events-none"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
