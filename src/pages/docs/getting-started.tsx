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
    title: "Choose Content",
    description:
      "Browse our extensive library or use our AI to find trending clips from top streamers.",
  },
  {
    title: "Select Template",
    description:
      "Pick from our collection of templates designed for maximum engagement on each platform.",
  },
  {
    title: "Customize",
    description:
      "Add your personal touch with our AI-assisted editing tools, including smart captions and effects.",
  },
  {
    title: "Generate",
    description:
      "Let our AI work its magic to create a viral-worthy clip in seconds.",
  },
  {
    title: "Publish & Track",
    description:
      "Share your clip across multiple platforms and track its performance with our analytics dashboard.",
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
          <h1 className="text-4xl font-bold mb-4">
            Getting Started with CashClips
          </h1>
          <p className="text-xl mb-8">
            Welcome to CashClips! This guide will help you create your first
            viral-worthy video clip in minutes, featuring content from top
            creators like xQc, MrBeast, and Kai Cenat.
          </p>
        </motion.section>

        <motion.section variants={fadeInUp}>
          <h2 className="text-2xl font-semibold mb-6">Quick Start Guide</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center mr-3">
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
          <h2 className="text-2xl font-semibold mb-6">
            Advanced CashClips Features
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full">
                  <CardHeader>
                    <feature.icon className="w-8 h-8 mb-2 text-primary" />
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
          className="bg-accent p-8 rounded-lg"
        >
          <h2 className="text-2xl font-semibold mb-4">
            Ready to Create Your First Viral Clip?
          </h2>
          <p className="text-lg mb-6">
            With CashClips, you are just minutes away from creating content that
            will captivate your audience and potentially go viral. Start with
            clips from top creators like Adin Ross, Pokimane, and Ludwig!
          </p>
          <Link href="/pricing">
            <Button size="lg">
              Start Clipping Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.section>
      </motion.div>
    </DocsLayout>
  );
};

export default GettingStartedPage;
