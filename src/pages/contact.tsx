import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldError, useForm } from "react-hook-form";
import { Mail, Search, Send } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { toast } from "sonner";

const faqs = [
  {
    question: "What is CashClips?",
    answer:
      "CashClips is a powerful platform that helps content creators easily clip, edit, and share moments from their streams or videos. We offer automated features and a wide range of templates to make content creation effortless and engaging.",
  },
  {
    question: "How do I get started with CashClips?",
    answer:
      "Sign up for an account, choose a plan, and start creating clips right away using our intuitive interface. You can immediately access thousands of videos from popular streamers and use our templates to create engaging content.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards and PayPal for our subscription plans.",
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer:
      "Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.",
  },
  {
    question: "How many videos do you have in your library?",
    answer:
      "We automatically add thousands of videos from popular streamers to our library. Our collection is constantly growing, ensuring you always have fresh content to work with.",
  },
  {
    question: "What if I can't find videos from my favorite streamer?",
    answer:
      "If you don't see videos from your favorite streamer, you can request them through our platform. We're always expanding our library based on user requests.",
  },
  {
    question: "How many templates do you offer?",
    answer:
      "We currently offer 10+ professionally designed templates, with more being added regularly. These templates cover a wide range of styles and formats to suit different content needs.",
  },
  {
    question: "Do you offer automatic captioning?",
    answer:
      "Yes! We automatically generate captions for your videos when you're creating clips. This feature enhances accessibility and engagement for your content.",
  },
  {
    question: "What are split videos?",
    answer:
      "Split videos are pre-made gaming or event segments that you can use to enhance your clips. We offer hundreds of these split videos, allowing you to easily add them to your content.",
  },
  {
    question: "Is there a limit to how many clips I can create?",
    answer:
      "The number of clips you can create depends on your subscription plan. Check our pricing page for detailed information on clip limits for each plan.",
  },
  {
    question: "Can I collaborate with other creators on CashClips?",
    answer:
      "Currently, CashClips is designed for individual use. However, we're exploring collaboration features for future updates. Stay tuned!",
  },
  {
    question: "How often do you update your video library?",
    answer:
      "We update our video library regularly, adding new content from popular streamers and events. This ensures you always have access to the latest and most relevant content.",
  },
  {
    question: "Is there a mobile app for CashClips?",
    answer:
      "Yes! CashClips is 100% compatible with desktop and mobile devices. Our platform is designed to work seamlessly across all platforms.",
  },
];

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Message sent successfully!");
        reset();
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="mb-8 text-center text-4xl font-bold">Contact Us</h1>
        <p className="mb-12 text-center text-muted-foreground">
          We would love to hear from you. Please fill out this form or check our
          FAQ section below.
        </p>
      </motion.div>

      <div className="grid gap-12 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>
                Fill out the form below and we will get back to you as soon as
                possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Input
                    placeholder="Your Name"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {(errors.name as FieldError).message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {(errors.email as FieldError).message}
                    </p>
                  )}
                </div>
                <div>
                  <Textarea
                    placeholder="Your Message"
                    {...register("message", {
                      required: "Message is required",
                    })}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">
                      {(errors.message as FieldError).message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                You can also reach us using the following email.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Mail className="mr-3 h-5 w-5 text-primary" />
                <p>support@cashclips.com</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        id="faqs"
        className="mt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h2 className="mb-8 text-center text-3xl font-bold">
          Frequently Asked Questions
        </h2>
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Accordion type="single" collapsible className="w-full">
          {filteredFaqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  );
}
