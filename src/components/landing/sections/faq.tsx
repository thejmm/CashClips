// src/components/landing/sections/faq.tsx
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion, useInView } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { InfoIcon } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

const faqs = [
  {
    section: "Website Builder",
    qa: [
      {
        question: "What makes our website builder unique?",
        answer: (
          <span>
            Our website builder combines the power of drag-and-drop simplicity
            with the flexibility of high-quality, open-source components. We
            leverage libraries like{" "}
            <Link
              href="https://ui.shadcn.com"
              className="text-primary hover:underline"
            >
              shadcn/ui
            </Link>{" "}
            and{" "}
            <Link
              href="https://magicui.design"
              className="text-primary hover:underline"
            >
              Magic UI
            </Link>{" "}
            to provide you with beautiful, customizable elements that you can
            easily incorporate into your designs.
          </span>
        ),
      },
      {
        question: "How does the drag-and-drop editor work?",
        answer: (
          <span>
            Our intuitive drag-and-drop editor allows you to create stunning
            websites without coding. You can easily arrange and customize
            pre-built sections and components, all of which are based on
            production-ready, accessible React components from shadcn/ui and
            Magic UI. This approach ensures your site is not only visually
            appealing but also performant and accessible.
          </span>
        ),
      },
      {
        question: "Are the templates responsive?",
        answer: (
          <span>
            Absolutely! All our templates are fully responsive, thanks to the
            underlying responsive design of the shadcn and Magic UI components.
            Your websites will look great on desktops, tablets, and mobile
            devices, providing an optimal viewing experience across all screen
            sizes.
          </span>
        ),
      },
    ],
  },
  {
    section: "Components and Customization",
    qa: [
      {
        question: "What are shadcn and Magic UI components?",
        answer: (
          <span>
            shadcn/ui and Magic UI are collections of high-quality, customizable
            React components. By incorporating these into our builder, we
            provide you with a wide range of beautiful, accessible, and
            responsive elements to use in your websites. These components are
            designed to be easily customizable, allowing you to tailor them to
            your brand and vision.
          </span>
        ),
      },
      {
        question: "Can I customize the pre-built sections and components?",
        answer: (
          <span>
            Absolutely! All pre-built sections and components in our builder are
            fully customizable. You can modify colors, fonts, layouts, and
            content to match your brand. The underlying shadcn and Magic UI
            components are designed with customization in mind, giving you the
            flexibility to create unique designs.
          </span>
        ),
      },
      {
        question: "Can I contribute to the components used in the builder?",
        answer: (
          <span>
            While you cant directly contribute to the components within our
            builder, we encourage contributions to the open-source projects we
            use. If you have ideas or improvements for the shadcn/ui or Magic UI
            components, you can contribute to their respective GitHub
            repositories. This collaborative approach helps improve the
            ecosystem for everyone.
          </span>
        ),
      },
    ],
  },
  {
    section: "Tools and Features",
    qa: [
      {
        question: "What additional tools are available with the builder?",
        answer: (
          <span>
            Our builder includes several powerful tools to enhance your website
            creation process:
            <ul className="list-disc pl-5 mt-2">
              <li>SEO Optimizer: Improve your sites search engine ranking</li>
              <li>
                Meta Tag Generator: Create effective meta tags for better
                visibility
              </li>
              <li>
                Theme Generator: Design harmonious color schemes for your site
              </li>
              <li>
                Accessibility Checker: Ensure your site is usable by people with
                various disabilities
              </li>
            </ul>
            These tools work seamlessly with the shadcn and Magic UI components
            to help you create not just beautiful, but also optimized and
            accessible websites.
          </span>
        ),
      },
    ],
  },
  {
    section: "Technology and Export",
    qa: [
      {
        question: "What technologies does the builder use?",
        answer: (
          <span>
            Our builder is built on React and Next.js, leveraging the power of
            shadcn/ui and Magic UI components. This stack ensures that your
            websites are not only visually appealing but also performant and
            built on modern web technologies.
          </span>
        ),
      },
      {
        question: "Can I export the code for my website?",
        answer: (
          <span>
            Yes, you can export clean, production-ready code for your website.
            The exported code will include the necessary shadcn and Magic UI
            components, allowing for further customization if needed. This
            approach ensures your site is built on a solid, efficient codebase
            while giving you the flexibility to extend it further.
          </span>
        ),
      },
    ],
  },
  {
    section: "Support and Resources",
    qa: [
      {
        question: "What kind of support is available?",
        answer: (
          <span>
            We offer comprehensive support including detailed documentation,
            video tutorials, and a community forum. For our paid plans, we also
            provide direct email support. Additionally, since we use open-source
            components, you can benefit from the broader shadcn and Magic UI
            communities for component-specific questions and customizations.
          </span>
        ),
      },
    ],
  },
];

export function FAQ() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section id="faq" ref={sectionRef}>
      <div className="py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            className="mx-auto max-w-5xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold tracking-tight text-black dark:text-white sm:text-6xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-6 text-xl leading-8 text-black/80 dark:text-white">
              Learn more about our powerful website builder that leverages the
              best open-source components to help you create stunning, optimized
              websites.
            </p>
          </motion.div>
          <div className="container mx-auto my-12 max-w-[600px] space-y-12">
            {faqs.map((faq, idx) => (
              <motion.section
                key={idx}
                id={"faq-" + faq.section}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6, delay: 0.2 + idx * 0.1 }}
              >
                <h2 className="mb-4 text-left text-base font-semibold tracking-tight text-foreground/60">
                  {faq.section}
                </h2>
                <Accordion
                  type="single"
                  collapsible
                  className="flex w-full flex-col items-center justify-center"
                >
                  {faq.qa.map((item, idx) => (
                    <AccordionItem
                      key={idx}
                      value={item.question}
                      className="w-full max-w-[600px]"
                    >
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent>{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.section>
            ))}
          </div>
          <motion.h4
            className="mb-12 text-center text-sm font-medium tracking-tight text-foreground/80"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Still have questions? Email us at{" "}
            <a href="mailto:support@example.com" className="underline">
              support@example.com
            </a>
          </motion.h4>
        </div>
      </div>
    </section>
  );
}
