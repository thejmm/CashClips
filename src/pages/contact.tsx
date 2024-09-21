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
    question: "What is BuildFlow?",
    answer:
      "BuildFlow is a powerful website builder that allows you to create stunning websites using a drag-and-drop interface. It offers a wide range of templates, components, and tools to help you build professional-looking websites without coding knowledge.",
  },
  {
    question: "Is BuildFlow free to use?",
    answer:
      "BuildFlow offers free tools with an account, including an SEO Optimizer, Meta Tag Generator, Accessibility Checker, and Theme Generator. However, to use the full editor for building and exporting code, you'll need to subscribe to one of our paid plans.",
  },
  {
    question: "Do I need coding skills to use BuildFlow?",
    answer:
      "No, you don't need coding skills to use BuildFlow. Our drag-and-drop builder and pre-designed templates make it easy for anyone to create professional-looking websites. However, if you have coding knowledge, you can also customize your site further using our code editor.",
  },
  {
    question: "What kind of websites can I build with BuildFlow?",
    answer:
      "BuildFlow is versatile and can be used to create various types of websites, including personal blogs, portfolios, business websites, e-commerce stores, landing pages, and more. Our template library covers a wide range of industries and purposes.",
  },
  {
    question: "Can I use my own domain name with BuildFlow?",
    answer:
      "Yes, you can use your own domain name with BuildFlow. We provide easy-to-follow instructions for connecting your custom domain to your BuildFlow website. This feature is available on our paid plans.",
  },
  {
    question: "Is BuildFlow SEO-friendly?",
    answer:
      "Yes, BuildFlow is designed with SEO in mind. We offer built-in SEO tools, including our SEO Optimizer and Meta Tag Generator, to help improve your website's search engine rankings. Additionally, our generated code follows SEO best practices.",
  },
  {
    question: "Can I export my website's code?",
    answer:
      "Yes, with our paid plans, you can export your website's code. This allows you to host your website on any platform you prefer or make further customizations outside of BuildFlow.",
  },
  {
    question: "Is my website mobile-responsive?",
    answer:
      "Yes, all websites created with BuildFlow are automatically mobile-responsive. Our templates and components are designed to look great on desktop, tablet, and mobile devices, ensuring a consistent user experience across all screen sizes.",
  },
  {
    question: "What are the free tools available with BuildFlow?",
    answer:
      "BuildFlow offers several free tools with an account, including: SEO Optimizer, Meta Tag Generator, Accessibility Checker, and Theme Generator. These tools can be used to improve your website's performance and appearance without a paid subscription.",
  },
  {
    question: "Do you offer customer support?",
    answer:
      "Yes, we offer customer support to all our users. Free users can access our comprehensive knowledge base and community forums. Paid subscribers receive priority email support, and our higher-tier plans include live chat and phone support options.",
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
        <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
        <p className="text-center text-muted-foreground mb-12">
          We would love to hear from you. Please fill out this form or check our
          FAQ section below.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12">
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
                    <p className="text-sm text-red-500 mt-1">
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
                    <p className="text-sm text-red-500 mt-1">
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
                    <p className="text-sm text-red-500 mt-1">
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
                <Mail className="h-5 w-5 mr-3 text-primary" />
                <a
                  href="mailto:support@buildflow.com"
                  className="underline"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  support@buildflow.site
                </a>
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
        <h2 className="text-3xl font-bold text-center mb-8">
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
