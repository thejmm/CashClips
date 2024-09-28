// src/pages/contact.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Home, Mail, Send, XCircle } from "lucide-react";
import { useState } from "react";
import { FieldError, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NextSeo } from "next-seo";
import Link from "next/link";

const MotionCard = motion(Card);

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSuccess(true);
        reset();
      } else {
        setIsError(true);
      }
    } catch (error) {
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.6 } },
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.5 } },
  };

  const StatusMessage = ({ isSuccess }: { isSuccess: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-6 text-center"
    >
      {isSuccess ? (
        <>
          <CheckCircle className="mb-4 h-16 w-16 text-green-500" />
          <h2 className="mb-2 text-2xl font-bold">
            Message Sent Successfully!
          </h2>
          <p className="text-muted-foreground">
            Thank you for reaching out. We will be in touch within 1-2 business
            days.
          </p>
        </>
      ) : (
        <>
          <XCircle className="mb-4 h-16 w-16 text-red-500" />
          <h2 className="mb-2 text-2xl font-bold">
            Oops! Something went wrong.
          </h2>
          <p className="text-muted-foreground">
            Please try again later or contact us directly at
            support@cashclips.io.
          </p>
        </>
      )}
      <Link href="/" passHref>
        <Button className="mt-6">
          <Home className="mr-2 h-4 w-4" />
          Return to Home
        </Button>
      </Link>
    </motion.div>
  );

  return (
    <>
      <NextSeo
        title="Contact Us - CashClips"
        description="Have a question or need assistance? Contact us at CashClips, and we'll get back to you promptly."
        canonical="https://cashclips.io/contact"
        openGraph={{
          url: "https://cashclips.io/contact",
          title: "Contact Us - CashClips",
          description:
            "Reach out to CashClips for any inquiries or assistance. Our team is here to help.",
          images: [
            {
              url: "https://cashclips.io/seo.png",
              width: 1200,
              height: 630,
              alt: "Contact Us - CashClips",
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
            href: "https://cashclips.io/contact",
          },
        ]}
      />
      <motion.div
        className="container mx-auto max-w-lg px-4 py-24"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <motion.div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">Get in Touch</h1>
          <p className="text-muted-foreground">
            Have a question or need assistance? We are here to help. Fill out
            the form below, and our team will get back to you promptly.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!isSuccess && !isError && (
            <MotionCard
              key="form"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-center">
                  <Mail className="mr-2 h-6 w-6" />
                  Send us a message
                </CardTitle>
                <CardDescription className="text-center">
                  We are excited to hear from you!
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
                      rows={4}
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
            </MotionCard>
          )}
          {(isSuccess || isError) && (
            <MotionCard
              key="status"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <StatusMessage isSuccess={isSuccess} />
            </MotionCard>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
