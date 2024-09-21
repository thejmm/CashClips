import {
  Boxes,
  Check,
  Code,
  FileCode,
  Layout,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";
import {
  FaCreditCard,
  FaDesktop,
  FaMobileAlt,
  FaPalette,
  FaTabletAlt,
  FaTools,
} from "react-icons/fa";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

import { Timeline } from "@/components/ui/timeline";

export function HowItWorksSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const data = [
    {
      title: "Choose Your Plan",
      content: (
        <div className="space-y-4">
          <div className="flex items-center mb-4">
            <Layout className="w-8 h-8 mr-4 text-primary" />
            <p className="text-neutral-800 dark:text-neutral-200 text-sm font-normal">
              Select the BuildFlow plan that best fits your code generation
              needs.
            </p>
          </div>
          <ul className="space-y-2">
            <li className="flex items-center">
              <Check className="w-5 h-5 mr-2 text-green-500" />
              <span>Basic Plan</span>
            </li>
            <li className="flex items-center">
              <Check className="w-5 h-5 mr-2 text-green-500" />
              <span>Pro Plan</span>
            </li>
            <li className="flex items-center">
              <Check className="w-5 h-5 mr-2 text-green-500" />
              <span>Ultimate Plan</span>
            </li>
            <li className="flex items-center">
              <Check className="w-5 h-5 mr-2 text-green-500" />
              <span>Agency Plan</span>
            </li>
            <li className="flex items-center">
              <Check className="w-5 h-5 mr-2 text-green-500" />
              <span>Enterprise</span>
            </li>
          </ul>
          <div className="flex items-center space-x-4 mt-4">
            <Zap className="w-6 h-6 text-yellow-500" />
            <p className="text-sm italic">
              Upgrade or downgrade at any time to match your project needs!
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Design Your Website",
      content: (
        <div className="space-y-4">
          <div className="flex items-center mb-4">
            <Code className="w-8 h-8 mr-4 text-primary" />
            <p className="text-neutral-800 dark:text-neutral-200 text-sm font-normal">
              Use our intuitive design interface to create your perfect website
              structure and layout.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Design Features:</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <FaTools className="w-5 h-5 mr-2 text-blue-500" />
                  <span>Drag-and-drop interface for layout design</span>
                </li>
                <li className="flex items-center">
                  <Boxes className="w-5 h-5 mr-2 text-blue-500" />
                  <span>Extensive component library</span>
                </li>
                <li className="flex items-center">
                  <FaPalette className="w-5 h-5 mr-2 text-blue-500" />
                  <span>Generate any color schemes</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Responsive Design:</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <FaDesktop className="w-5 h-5 mr-2 text-green-500" />
                  <span>Desktop layout optimization</span>
                </li>
                <li className="flex items-center">
                  <FaTabletAlt className="w-5 h-5 mr-2 text-green-500" />
                  <span>Tablet-friendly designs</span>
                </li>
                <li className="flex items-center">
                  <FaMobileAlt className="w-5 h-5 mr-2 text-green-500" />
                  <span>Mobile-first approach</span>
                </li>
                <li className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                  <span>Fully responsive</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Generate Optimized Code",
      content: (
        <div className="space-y-4">
          <div className="flex items-center mb-4">
            <Upload className="w-8 h-8 mr-4 text-primary" />
            <p className="text-neutral-800 dark:text-neutral-200 text-sm font-normal">
              Transform your design into clean, optimized code ready for
              deployment.
            </p>
          </div>
          <ul className="space-y-2">
            <li className="flex items-center">
              <Check className="w-5 h-5 mr-2 text-green-500" />
              <span>Automatic code generation based on your design</span>
            </li>
            <li className="flex items-center">
              <Check className="w-5 h-5 mr-2 text-green-500" />
              <span>Optimized for performance and SEO</span>
            </li>
          </ul>
          <div className="mt-4 space-y-2">
            <h4 className="font-semibold">Advanced Code Output Options:</h4>
            <ul className="grid grid-cols-2 gap-4">
              <li className="flex items-center space-x-2">
                <span>Modern TypeScript</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>React Components</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>Next.js Framework</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>Tailwind CSS Styling</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>Framer Motion Animations</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "Export and Deploy",
      content: (
        <div className="space-y-4">
          <div className="flex items-center mb-4">
            <Upload className="w-8 h-8 mr-4 text-primary" />
            <p className="text-neutral-800 dark:text-neutral-200 text-sm font-normal">
              Export your generated code and deploy it to your preferred
              platform.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Export Options:</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-500" />
                  <span>Download as ZIP file</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-500" />
                  <span>Copy & Paste Anything</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-500" />
                  <span>1 Click Vercel Deployment</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4">
            <Zap className="w-6 h-6 text-yellow-500" />
            <p className="text-sm italic">
              Your code is ready to be deployed on any platform of your choice!
            </p>
          </div>
        </div>
      ),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      id="how-it-works"
      className="rounded-3xl bg-accent py-12"
      ref={sectionRef}
    >
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <motion.h2
          className="text-4xl font-bold text-black dark:text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          How BuildFlow Works
        </motion.h2>
        <motion.p
          className="text-neutral-700 dark:text-neutral-300 text-base max-w-2xl mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Create and launch your perfect website in just five simple steps.
          BuildFlow streamlines the process, making it easy for you to design,
          build, and deploy your site quickly and efficiently.
        </motion.p>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <Timeline
            data={data.map((item, index) => ({
              ...item,
              content: (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  {item.content}
                </motion.div>
              ),
            }))}
          />
        </motion.div>
      </div>
    </section>
  );
}
