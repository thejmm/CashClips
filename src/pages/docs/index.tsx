// src/pages/docs/index.tsx
import {
  ArrowRight,
  DollarSign,
  Globe,
  Sparkles,
  Users,
  Video,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import DocsLayout from "@/components/docs/docs-layout";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const sections = [
  {
    title: "Getting Started",
    description:
      "Learn the basics of CashClips and create your first viral clip.",
    link: "/docs/getting-started",
    icon: Zap,
  },
  {
    title: "Affiliate",
    description: "Learn how to use CashClips affiliate program.",
    link: "/docs/affiliate",
    icon: DollarSign,
  },
];

const features = [
  {
    icon: Video,
    title: "Massive Clip Library",
    description: "Access 100,000+ clips from top streamers",
  },
  {
    icon: Users,
    title: "Top Creator Content",
    description: "Featuring xQc, MrBeast, Kai Cenat, and more",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Editing",
    description: "Create viral clips with one click",
  },
  {
    icon: Globe,
    title: "Multi-Platform Support",
    description: "Share on Twitch, YouTube, TikTok, and more",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const DocsHome: React.FC = () => {
  return (
    <DocsLayout>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="space-y-12"
      >
        <motion.h1 variants={fadeInUp} className="text-4xl font-bold mb-6">
          CashClips Documentation
        </motion.h1>
        <motion.div variants={fadeInUp} className="space-y-6">
          <p className="text-xl">
            Welcome to CashClips, the ultimate platform for creating viral
            content from top streamers. Our cutting-edge AI technology and vast
            library of clips empower you to produce share-worthy content in
            seconds.
          </p>

          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {sections.map((section) => (
              <Card key={section.title}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <section.icon className="mr-2 h-6 w-6 text-primary" />
                    {section.title}
                  </CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link key={section.title} href={section.link} passHref>
                    <Button
                      variant="ringHover"
                      className="group transition-all duration-300"
                    >
                      Explore{" "}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-all duration-300" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <feature.icon className="mr-2 h-6 w-6 text-primary" />
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </DocsLayout>
  );
};

export default DocsHome;
