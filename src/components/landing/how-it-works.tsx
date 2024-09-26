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
      title: "Select Your Streamer",
      content: (
        <div className="space-y-4">
          <div className="flex items-center">
            <FaStream className="mr-4 h-6 w-6 text-primary sm:h-8 sm:w-8" />
            <p className="text-xs font-normal text-neutral-800 dark:text-neutral-200 sm:text-sm">
              Pick the streamer you want to generate clips for from our library.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <img
              src="/streamers/jack-doherty.png"
              alt="Mass clips view"
              className="h-16 w-full rounded-lg object-contain sm:h-20 md:h-32 lg:h-48"
            />
            <img
              src="/streamers/ishowspeed.png"
              alt="Streamer selection"
              className="h-16 w-full rounded-lg object-contain sm:h-20 md:h-32 lg:h-48"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Select Your Clip",
      content: (
        <div className="space-y-4">
          <div className="flex items-center">
            <FaStream className="mr-4 h-6 w-6 text-primary sm:h-8 sm:w-8" />
            <p className="text-xs font-normal text-neutral-800 dark:text-neutral-200 sm:text-sm">
              Pick the clip from your favorite streamer from our mass library.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <video
              className="h-16 w-full rounded-lg object-cover sm:h-20 md:h-32 lg:h-44"
              autoPlay
              muted
              loop
              controls={false}
              playsInline
            >
              <source src="/assets/clips1.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <video
              className="h-16 w-full rounded-lg object-cover sm:h-20 md:h-32 lg:h-44"
              autoPlay
              muted
              loop
              controls={false}
              playsInline
            >
              <source src="/assets/clips2.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      ),
    },
    {
      title: "Pick a Template",
      content: (
        <div className="space-y-4">
          <div className="flex items-center">
            <Layout className="mr-4 h-6 w-6 text-primary sm:h-8 sm:w-8" />
            <p className="text-xs font-normal text-neutral-800 dark:text-neutral-200 sm:text-sm">
              Choose a template that fits your style and content.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <img
              src="/templates/blur-landscape.png"
              alt="Template selection"
              className="h-16 w-full rounded-lg object-cover sm:h-20 md:h-32 lg:h-44"
            />
            <img
              src="/templates/blur-portrait.png"
              alt="Template customization"
              className="h-16 w-full rounded-lg object-cover sm:h-20 md:h-32 lg:h-44"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <img
              src="/templates/split-screen-portrait.png"
              alt="Template selection"
              className="h-16 w-full rounded-lg object-cover sm:h-20 md:h-32 lg:h-44"
            />
            <img
              src="/templates/split-screen-landscape.png"
              alt="Template customization"
              className="h-16 w-full rounded-lg object-cover sm:h-20 md:h-32 lg:h-44"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Caption Your Clip",
      content: (
        <div className="space-y-4">
          <div className="flex items-center">
            <FaClosedCaptioning className="mr-4 h-6 w-6 text-primary sm:h-8 sm:w-8" />
            <p className="text-xs font-normal text-neutral-800 dark:text-neutral-200 sm:text-sm">
              Choose to auto-caption your clips or manually add captions.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <img
              src="/assets/captions1.png"
              alt="Auto captioning"
              className="h-16 w-full rounded-lg object-contain sm:h-20 md:h-32 lg:h-44"
            />
            <img
              src="/assets/captions2.png"
              alt="Manual captioning"
              className="h-16 w-full rounded-lg object-contain sm:h-20 md:h-32 lg:h-44"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Generate & Share",
      content: (
        <div className="space-y-4">
          <div className="flex items-center">
            <Share className="mr-4 h-6 w-6 text-primary sm:h-8 sm:w-8" />
            <p className="text-xs font-normal text-neutral-800 dark:text-neutral-200 sm:text-sm">
              Create your clip, download, and share it across platforms.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            <video
              className="h-24 w-auto rounded-lg object-contain sm:h-28 md:h-40 lg:h-56"
              autoPlay
              muted
              loop
              controls={false}
              playsInline
            >
              <source src="/assets/share2.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <video
              className="h-28 w-auto rounded-lg object-contain sm:h-32 md:h-48 lg:h-64"
              autoPlay
              muted
              loop
              controls={false}
              playsInline
            >
              <source src="/assets/share1.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <video
              className="h-24 w-auto rounded-lg object-contain sm:h-28 md:h-40 lg:h-56"
              autoPlay
              muted
              loop
              controls={false}
              playsInline
            >
              <source src="/assets/share3.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
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
      className="rounded-3xl bg-secondary py-8 sm:py-12"
      ref={sectionRef}
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 md:px-8 lg:px-10 lg:py-20">
        <motion.h2
          className="mb-2 text-2xl font-bold text-black dark:text-white sm:text-3xl md:mb-4 md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          How CashClips Works
        </motion.h2>
        <motion.p
          className="mb-8 max-w-2xl text-sm text-neutral-700 dark:text-neutral-300 sm:text-base md:mb-12"
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
