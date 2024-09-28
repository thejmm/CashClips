// src/pages/docs/index.tsx
import {
  ArrowRight,
  Clock,
  DollarSign,
  Globe,
  Layout,
  MessageSquareText,
  Sparkles,
  User,
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
import { NextSeo } from "next-seo";
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

const streamers = [
  "Jack Doherty",
  "iShowSpeed",
  "Kai Cenat",
  "xQc",
  "Adin Ross",
  "Agent00",
  "Amouranth",
  "Jynxzi",
  "Lacy",
  "Nadia",
  "Pokimane",
  "shroud",
  "stableronaldo",
  "AND GROWING!!",
];

const highlights = [
  {
    icon: Users,
    title: "Streamers",
    value: "13+",
    description: "Growing daily",
  },
  { icon: Video, title: "Clips", value: "5,000+", description: "Added daily" },
  {
    icon: Layout,
    title: "Templates",
    value: "5",
    description: "And expanding",
  },
  {
    icon: Clock,
    title: "Creation Time",
    value: "Minutes",
    description: "Quick and easy",
  },
  {
    icon: MessageSquareText,
    title: "Auto Captioning",
    value: "Included",
    description: "For all clips",
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
    <>
      <NextSeo
        title="Documentation - CashClips"
        description="Explore the CashClips documentation to learn how to use our powerful platform for creating viral clips and growing your content."
        canonical="https://cashclips.io/docs"
        openGraph={{
          url: "https://cashclips.io/docs",
          title: "CashClips Documentation - Learn & Get Started",
          description:
            "Learn how to use CashClips to create viral content from top streamers with ease.",
          images: [
            {
              url: "https://cashclips.io/seo.svg",
              width: 1200,
              height: 630,
              alt: "CashClips Documentation",
            },
          ],
        }}
        twitter={{
          handle: "@cashclipsio",
          site: "@cashclipsio",
          cardType: "summary_large_image",
        }}
      />
      <DocsLayout>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="space-y-12"
        >
          <motion.h1 variants={fadeInUp} className="mb-6 text-4xl font-bold">
            CashClips Documentation
          </motion.h1>

          <motion.div variants={fadeInUp} className="space-y-6">
            <p className="text-xl">
              Welcome to CashClips, the ultimate platform for creating viral
              content from top streamers. Our cutting-edge AI technology and
              vast library of clips empower you to produce share-worthy content
              in seconds.
            </p>

            <motion.div variants={fadeInUp} className="my-8">
              <h2 className="mb-4 text-2xl font-semibold">
                CashClips at a Glance
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                {highlights.map((item) => (
                  <Card key={item.title} className="bg-secondary">
                    <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                      <item.icon className="mb-2 h-8 w-8 text-primary" />
                      <h3 className="text-lg font-bold">{item.value}</h3>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Keep the existing sections for Getting Started and Affiliate */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-1 gap-6 md:grid-cols-2"
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
                        <ArrowRight className="ml-2 h-4 w-4 transition-all duration-300 group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </motion.div>

          {/* Keep the existing Key Features section */}
          <motion.div variants={fadeInUp}>
            <h2 className="mb-4 text-2xl font-semibold">Key Features</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

          {/* Keep the existing Available Streamers section */}
          <motion.div variants={fadeInUp}>
            <h2 className="mb-4 text-2xl font-semibold">Available Streamers</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {streamers.map((streamer) => (
                <Card key={streamer}>
                  <CardContent className="flex items-center p-4">
                    <User className="mr-2 h-5 w-5 text-primary" />
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium">
                      {streamer}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </DocsLayout>
    </>
  );
};

export default DocsHome;
