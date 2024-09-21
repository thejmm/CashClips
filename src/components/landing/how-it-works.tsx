"use client";

import { FaClosedCaptioning, FaGamepad, FaStream } from "react-icons/fa";
import { Layout, Scissors, Share } from "lucide-react";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

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
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full"
            />
            <img
              src="https://via.placeholder.com/500x500.png?text=Template+Customization"
              alt="Template customization"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Choose Game Type",
      content: (
        <div>
          <div className="flex items-center mb-4">
            <FaGamepad className="w-8 h-8 mr-4 text-primary" />
            <p className="text-neutral-800 dark:text-neutral-200 text-sm font-normal">
              Select the type of game and customize additional settings like
              split templates.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://via.placeholder.com/500x500.png?text=Game+Type"
              alt="Game Type"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full"
            />
            <img
              src="https://via.placeholder.com/500x500.png?text=Split+Template+Options"
              alt="Split Template"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Select Your Streamer",
      content: (
        <div>
          <div className="flex items-center mb-4">
            <FaStream className="w-8 h-8 mr-4 text-primary" />
            <p className="text-neutral-800 dark:text-neutral-200 text-sm font-normal">
              Pick the streamer you want to generate clips for from our library.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://via.placeholder.com/500x500.png?text=Streamer+Selection"
              alt="Streamer selection"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full"
            />
            <img
              src="https://via.placeholder.com/500x500.png?text=Mass+Clips+View"
              alt="Mass clips view"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full"
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
              Choose to auto-caption your clips or manually add captions.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://via.placeholder.com/500x500.png?text=Auto+Captioning"
              alt="Auto captioning"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full"
            />
            <img
              src="https://via.placeholder.com/500x500.png?text=Manual+Captioning"
              alt="Manual captioning"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full"
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
              Create your clip, download, and share it across platforms.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://via.placeholder.com/500x500.png?text=Clip+Generation"
              alt="Clip generation"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full"
            />
            <img
              src="https://via.placeholder.com/500x500.png?text=Sharing+Options"
              alt="Sharing options"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full"
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
