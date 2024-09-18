"use client";

import { Layout, Scissors, Share } from "lucide-react";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

import { FaClosedCaptioning } from "react-icons/fa";
import { Timeline } from "@/components/ui/timeline";

export function HowItWorksSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const data = [
    {
      title: "Pick a Template",
      content: (
        <div>
          <div className="flex items-center mb-4">
            <Layout className="w-8 h-8 mr-4 text-primary" />
            <p className="text-neutral-800 dark:text-neutral-200 text-sm font-normal">
              Choose a template that fits your style and content.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://via.placeholder.com/500x500.png?text=Template+Gallery"
              alt="Template selection"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://via.placeholder.com/500x500.png?text=Template+Customization"
              alt="Template customization"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Choose Your Clip",
      content: (
        <div>
          <div className="flex items-center mb-4">
            <Scissors className="w-8 h-8 mr-4 text-primary" />
            <p className="text-neutral-800 dark:text-neutral-200 text-sm font-normal">
              Select from our vast library of raw clips.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://via.placeholder.com/500x500.png?text=Clip+Library"
              alt="Clip library"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://via.placeholder.com/500x500.png?text=Clip+Selection"
              alt="Clip selection"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Caption Your Clip",
      content: (
        <div>
          <div className="flex items-center mb-4">
            <FaClosedCaptioning className="w-8 h-8 mr-4 text-primary" />
            <p className="text-neutral-800 dark:text-neutral-200 text-sm font-normal">
              Choose to auto caption or no caption at all.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://via.placeholder.com/500x500.png?text=Auto+Captioning"
              alt="Auto captioning"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://via.placeholder.com/500x500.png?text=Caption+Editing"
              alt="Caption editing"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Generate & Share",
      content: (
        <div>
          <div className="flex items-center mb-4">
            <Share className="w-8 h-8 mr-4 text-primary" />
            <p className="text-neutral-800 dark:text-neutral-200 text-sm font-normal">
              Create your clip, save it, and share it with the world!
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://via.placeholder.com/500x500.png?text=Clip+Generation"
              alt="Clip generation"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://via.placeholder.com/500x500.png?text=Sharing+Options"
              alt="Sharing options"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      id="how-it-works"
      className="rounded-3xl bg-accent py-12"
      ref={sectionRef}
    >
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <motion.h2
          className="text-4xl font-bold text-black dark:text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          How CashClips Works
        </motion.h2>
        <motion.p
          className="text-neutral-700 dark:text-neutral-300 text-base max-w-2xl mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Create amazing clips in just four simple steps. CashClips streamlines
          the process, making it easy for you to generate engaging content.
        </motion.p>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <Timeline
            data={data.map((item, index) => ({
              ...item,
              content: (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  {item.content}
                </motion.div>
              ),
            }))}
          />
        </motion.div>
      </div>
    </section>
  );
}
