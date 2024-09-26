// src/pages/docs/getting-started.tsx

import {
  ArrowRight,
  Edit,
  Globe,
  Sparkles,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import DocsLayout from "@/components/docs/docs-layout";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Video,
    title: "Clip Library",
    description:
      "Access over 100,000 clips from top streamers like xQc, MrBeast, and Kai Cenat. Our AI curates the best moments so you don't have to spend hours watching streams.",
  },
  {
    icon: Edit,
    title: "Advanced Templates",
    description:
      "Choose from 50+ professionally designed templates, including dynamic overlays, transitions, and effects tailored for each platform's requirements.",
  },
  {
    icon: Users,
    title: "Streamer Picks",
    description:
      "Get instant access to viral moments from Adin Ross, Pokimane, Ludwig, and more. Our AI predicts which clips are likely to go viral based on current trends.",
  },
  {
    icon: Sparkles,
    title: "AI Captions & Translations",
    description:
      "Our advanced AI not only generates catchy captions but also translates content into 20+ languages, helping you reach a global audience.",
  },
  {
    icon: Zap,
    title: "One-Click Viral Clips",
    description:
      "Our proprietary algorithm analyzes thousands of viral videos to create clips that are scientifically engineered for maximum engagement and shareability.",
  },
  {
    icon: Globe,
    title: "Multi-Platform Optimization",
    description:
      "Automatically optimize your clips for Twitch, YouTube Shorts, TikTok, Instagram Reels, and Twitter. We handle aspect ratios, durations, and platform-specific features.",
  },
];

const steps = [
  {
    title: "Sign Up",
    description:
      "Create your CashClips account and choose your favorite content creators to follow.",
  },
  {
    title: "Choose Streamer",
    description: "Browse our extensive library of streamers to choose from.",
  },
  {
    title: "Choose Content",
    description:
      "Browse our extensive library to find trending clips from top streamers.",
  },
  {
    title: "Select Template",
    description:
      "Pick from our collection of templates designed for maximum engagement on each platform.",
  },
  {
    title: "View & Edit",
    description:
      "View and choose wether to add your captions based on your preferences.",
  },
  {
    title: "Generate",
    description:
      "Let us process the hard work and use our magic to create a viral-worthy clip in minutes.",
  },
  {
    title: "Download & Publish",
    description: "Download and share your clip across multiple platforms",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const GettingStartedPage: React.FC = () => {
  return (
    <DocsLayout>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="space-y-12"
      >
        <motion.section variants={fadeInUp}>
          <h1 className="mb-4 text-4xl font-bold">Getting Started</h1>
          <p className="mb-8 text-xl">
            This guide will help you create your first viral-worthy video clip
            in minutes, featuring content from top creators like xQc, MrBeast,
            and Kai Cenat.
          </p>
        </motion.section>

        <motion.section variants={fadeInUp}>
          <h2 className="mb-6 text-2xl font-semibold">Quick Start Guide</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        {index + 1}
                      </span>
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section variants={fadeInUp}>
          <h2 className="mb-6 text-2xl font-semibold">
            Advanced CashClips Features
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full">
                  <CardHeader>
                    <feature.icon className="mb-2 h-8 w-8 text-primary" />
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          variants={fadeInUp}
          className="rounded-lg bg-accent p-8"
        >
          <h2 className="mb-4 text-2xl font-semibold">
            Ready to Create Your First Viral Clip?
          </h2>
          <p className="mb-6 text-lg">
            With CashClips, you are just minutes away from creating content that
            will captivate your audience and potentially go viral. Start with
            clips from top creators like Adin Ross, Pokimane, and Ludwig!
          </p>
          <Link href="/pricing">
            <Button
              variant="ringHover"
              className="group transition-all duration-300"
            >
              Start Clipping Now
              <ArrowRight className="ml-2 h-4 w-4 transition-all duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.section>
      </motion.div>
    </DocsLayout>
  );
};

export default GettingStartedPage;
