import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ArrowRight,
  CheckCircle,
  Edit,
  Globe,
  Info,
  Sparkles,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      "Access over 100,000 clips from top streamers. Our AI curates the best moments.",
  },
  {
    icon: Edit,
    title: "Advanced Templates",
    description:
      "Choose from 50+ professionally designed templates tailored for each platform.",
  },
  {
    icon: Users,
    title: "Streamer Picks",
    description: "Get instant access to viral moments from top creators.",
  },
  {
    icon: Sparkles,
    title: "AI Captions & Translations",
    description:
      "Generate catchy captions and translate content into 20+ languages.",
  },
  {
    icon: Zap,
    title: "One-Click Viral Clips",
    description:
      "Our algorithm creates clips engineered for maximum engagement.",
  },
  {
    icon: Globe,
    title: "Multi-Platform Optimization",
    description:
      "Automatically optimize clips for various social media platforms.",
  },
];

const steps = [
  { title: "Sign Up", description: "Create your CashClips account." },
  { title: "Choose Streamer", description: "Browse our library of streamers." },
  {
    title: "Select Content",
    description: "Find trending clips from top streamers.",
  },
  { title: "Pick Template", description: "Choose a template for your clip." },
  {
    title: "Edit & Customize",
    description: "Adjust captions and make final edits.",
  },
  {
    title: "Generate",
    description: "Create your viral-worthy clip in minutes.",
  },
  {
    title: "Publish",
    description: "Share your clip across multiple platforms.",
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
          <h1 className="mb-4 text-4xl font-bold">
            Getting Started with CashClips
          </h1>
          <p className="mb-8 text-xl">
            Welcome to CashClips! This guide will walk you through the process
            of creating your first viral-worthy video clip using our advanced
            AI-powered platform.
          </p>
        </motion.section>

        <motion.section variants={fadeInUp}>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Before you begin</AlertTitle>
            <AlertDescription>
              Make sure you have a CashClips account. If you haven&#39;t signed
              up yet,
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                {" "}
                create an account here
              </Link>
              .
            </AlertDescription>
          </Alert>
        </motion.section>

        <motion.section variants={fadeInUp}>
          <h2 className="mb-6 text-2xl font-semibold">
            Creating Your First Clip
          </h2>
          <ol className="space-y-4">
            {steps.map((step, index) => (
              <motion.li
                key={index}
                variants={fadeInUp}
                className="flex items-start"
              >
                <CheckCircle className="mr-2 h-6 w-6 flex-shrink-0 text-primary" />
                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </motion.section>

        <motion.section variants={fadeInUp}>
          <h2 className="mb-6 text-2xl font-semibold">Key Features</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="h-full">
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
        </motion.section>

        <motion.section
          variants={fadeInUp}
          className="rounded-lg bg-accent p-8"
        >
          <h2 className="mb-4 text-2xl font-semibold">
            Ready to Start Creating?
          </h2>
          <p className="mb-6 text-lg">
            Now that you are familiar with CashClips, it&#39;s time to create
            your first viral clip!
          </p>
          <Link href="/user/dashboard">
            <Button variant="default" size="lg" className="group">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.section>
      </motion.div>
    </DocsLayout>
  );
};

export default GettingStartedPage;
