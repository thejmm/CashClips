// src/pages/faq.tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Search } from "lucide-react";
import React, { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { NextSeo } from "next-seo";

const faqs = [
  {
    question: "What is CashClips?",
    answer:
      "CashClips is a powerful platform that helps content creators easily clip, edit, and share moments from their streams or videos. We offer automated features and a wide range of templates to make content creation effortless and engaging.",
    category: "General",
  },
  {
    question: "How do I get started with CashClips?",
    answer:
      "Sign up for an account, choose a plan, and start creating clips right away using our intuitive interface. You can immediately access thousands of videos from popular streamers and use our templates to create engaging content.",
    category: "Getting Started",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards and PayPal for our subscription plans.",
    category: "Billing",
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer:
      "Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.",
    category: "Billing",
  },
  {
    question: "How many videos do you have in your library?",
    answer:
      "We automatically add thousands of videos from popular streamers to our library. Our collection is constantly growing, ensuring you always have fresh content to work with.",
    category: "Content",
  },
  {
    question: "What if I can't find videos from my favorite streamer?",
    answer:
      "If you don't see videos from your favorite streamer, you can request them through our platform. We're always expanding our library based on user requests.",
    category: "Content",
  },
  {
    question: "How many templates do you offer?",
    answer:
      "We currently offer 10+ professionally designed templates, with more being added regularly. These templates cover a wide range of styles and formats to suit different content needs.",
    category: "Features",
  },
  {
    question: "Do you offer automatic captioning?",
    answer:
      "Yes! We automatically generate captions for your videos when you're creating clips. This feature enhances accessibility and engagement for your content.",
    category: "Features",
  },
  {
    question: "What are split videos?",
    answer:
      "Split videos are pre-made gaming or event segments that you can use to enhance your clips. We offer hundreds of these split videos, allowing you to easily add them to your content.",
    category: "Features",
  },
  {
    question: "Is there a limit to how many clips I can create?",
    answer:
      "The number of clips you can create depends on your subscription plan. Check our pricing page for detailed information on clip limits for each plan.",
    category: "Billing",
  },
  {
    question: "Can I collaborate with other creators on CashClips?",
    answer:
      "Currently, CashClips is designed for individual use. However, we're exploring collaboration features for future updates. Stay tuned!",
    category: "Features",
  },
  {
    question: "How often do you update your video library?",
    answer:
      "We update our video library regularly, adding new content from popular streamers and events. This ensures you always have access to the latest and most relevant content.",
    category: "Content",
  },
  {
    question: "Is there a mobile app for CashClips?",
    answer:
      "Yes! CashClips is 100% compatible with desktop and mobile devices. Our platform is designed to work seamlessly across all platforms.",
    category: "General",
  },
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const filteredFaqs = useMemo(() => {
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm]);

  const handleExpand = (value: string) => {
    setExpandedItems((prevItems) =>
      prevItems.includes(value)
        ? prevItems.filter((item) => item !== value)
        : [...prevItems, value],
    );
  };

  return (
    <>
      <NextSeo
        title="FAQ - CashClips"
        description="Find answers to common questions about CashClips. Learn about features, billing, and how to get started."
        canonical="https://cashclips.io/faq"
        openGraph={{
          url: "https://cashclips.io/faq",
          title: "Frequently Asked Questions - CashClips",
          description:
            "Find answers to common questions about CashClips. Learn about features, billing, and how to get started.",
          images: [
            {
              url: "https://cashclips.io/seo.svg",
              width: 1200,
              height: 630,
              alt: "CashClips FAQ",
            },
          ],
        }}
        twitter={{
          handle: "@cashclipsio",
          site: "@cashclipsio",
          cardType: "summary_large_image",
        }}
        additionalMetaTags={[
          {
            name: "robots",
            content: "index, follow",
          },
        ]}
        additionalLinkTags={[
          {
            rel: "canonical",
            href: "https://cashclips.io/faq",
          },
        ]}
      />
      <div className="container mx-auto max-w-4xl py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="mb-8 text-center text-4xl font-bold">
            Frequently Asked Questions
          </h1>
          <p className="mb-12 text-center text-muted-foreground">
            Find answers to common questions about CashClips.
          </p>
        </motion.div>

        <div className="mb-8 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
          </div>
        </div>

        <AnimatePresence>
          {filteredFaqs.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-gray-500"
            >
              No FAQs found. Try adjusting your search or category.
            </motion.p>
          ) : (
            <Accordion type="single" collapsible>
              {filteredFaqs.map((faq, index) => (
                <AccordionItem key={faq.question} value={`item-${index}`}>
                  <AccordionTrigger
                    onClick={() => handleExpand(`item-${index}`)}
                  >
                    <span>{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
