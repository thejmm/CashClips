// src/pages/docs/affiliate.tsx

import {
  BarChart,
  CheckCircle,
  DollarSign,
  Globe,
  Link as LinkIcon,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import DocsLayout from "@/components/docs/docs-layout";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const benefits = [
  {
    title: "Industry-Leading 5% Commission",
    description:
      "Earn a generous 5% on all referrals, including recurring subscriptions. Our rates beat the competition!",
    icon: DollarSign,
  },
  {
    title: "Lifetime Recurring Income",
    description:
      "Earn from subscription renewals for the entire lifetime of the customer. Your earnings grow over time!",
    icon: BarChart,
  },
  {
    title: "30-Day Cookie Window",
    description:
      "Our 30-day attribution window ensures you get credit for your hard work, even if users don't sign up immediately.",
    icon: LinkIcon,
  },
  {
    title: "Real-Time Analytics Dashboard",
    description:
      "Track your earnings, clicks, and conversions in real-time with our advanced affiliate dashboard.",
    icon: CheckCircle,
  },
  {
    title: "Access to Exclusive Content",
    description:
      "Get early access to new features and exclusive content from top streamers like xQc, MrBeast, and Kai Cenat to share with your audience.",
    icon: Users,
  },
  {
    title: "Multi-Tier Commissions",
    description:
      "Earn additional commissions by referring other affiliates. Build your own network and increase your earnings!",
    icon: Zap,
  },
  {
    title: "Global Payments",
    description:
      "We support multiple payout methods including PayPal, Direct Deposit, and Cryptocurrency for global affiliates.",
    icon: Globe,
  },
  {
    title: "Trending Content Alerts",
    description:
      "Receive notifications about viral clips and trending streamers to stay ahead of the curve in your promotions.",
    icon: TrendingUp,
  },
];

const steps = [
  {
    title: "Sign Up",
    description:
      "Create your free CashClips affiliate account in under 2 minutes.",
  },
  {
    title: "Get Your Links",
    description:
      "Generate custom affiliate links and promo codes for your audience.",
  },
  {
    title: "Promote CashClips",
    description:
      "Share your unique links across your social media, website, or YouTube channel.",
  },
  {
    title: "Track Performance",
    description:
      "Monitor your earnings and optimize your strategies using our real-time dashboard.",
  },
  {
    title: "Earn Commissions",
    description:
      "Get paid monthly for all the subscriptions and renewals you bring in.",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const AffiliatePage: React.FC = () => {
  return (
    <DocsLayout>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="space-y-12"
      >
        <motion.section variants={fadeInUp} className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            CashClips Affiliate Program
          </h1>
          <p className="text-xl mb-8">
            Join the CashClips Affiliate Program and start earning substantial
            income by promoting the future of content creation. Tap into the
            power of viral clips from top streamers like xQc, MrBeast, Kai
            Cenat, and Adin Ross!
          </p>
          <Button variant="ringHover" asChild>
            <a
              href="https://cashclips.promotekit.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Now and Start Earning
            </a>
          </Button>
        </motion.section>

        <motion.section variants={fadeInUp}>
          <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
          <motion.div variants={stagger} className="grid gap-6 md:grid-cols-3">
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
          </motion.div>
        </motion.section>

        <motion.section variants={fadeInUp}>
          <h2 className="text-2xl font-semibold mb-6">Unmatched Benefits</h2>
          <motion.div
            variants={stagger}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {benefits.map((benefit, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card key={benefit.title} className="h-full">
                  <CardHeader>
                    <benefit.icon className="w-8 h-8 mb-2 text-primary" />
                    <CardTitle>{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          variants={fadeInUp}
          className="bg-accent p-8 rounded-lg"
        >
          <h2 className="text-2xl font-semibold mb-4">
            Why Become a CashClips Affiliate?
          </h2>
          <p className="text-lg mb-6">
            By recommending CashClips, you are not just earning money – you are
            empowering fellow creators with a tool that boosts engagement and
            streamlines content creation. Our platform features content from top
            streamers like xQc, MrBeast, Kai Cenat, and Adin Ross, giving your
            audience access to the best clips and editing tools in the industry.
          </p>
          <p className="text-lg mb-6">
            As an affiliate, you will be at the forefront of content creation
            technology, offering your audience a tool that can significantly
            boost their online presence and engagement.
          </p>
        </motion.section>

        <motion.section variants={fadeInUp} className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Ready to Start Earning?
          </h2>
          <p className="text-lg mb-6">
            Join the CashClips Affiliate Program today and start turning your
            influence into a steady stream of income. With our industry-leading
            commission rates, cutting-edge platform, and content from top
            streamers, the earning potential is limitless!
          </p>
          <Button variant="ringHover" asChild>
            <a
              href="https://cashclips.promotekit.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Now and Start Earning
            </a>
          </Button>
        </motion.section>

        <motion.section variants={fadeInUp} className="text-center">
          <p className="text-sm text-muted-foreground">
            <Link href="/terms-of-service-affiliate" passHref>
              <Button variant="linkHover2" className="text-sm px-0">
                Terms and conditions{" "}
              </Button>
            </Link>{" "}
            apply. Commission rates subject to change. Always comply with
            platform guidelines when promoting CashClips. Earning potential
            varies based on individual effort and audience engagement.
          </p>
        </motion.section>
      </motion.div>
    </DocsLayout>
  );
};

export default AffiliatePage;
