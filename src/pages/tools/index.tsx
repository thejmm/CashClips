// src/pages/tools/index.tsx

import { ArrowRight, Clock, Search, Star, Users, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { motion } from "framer-motion";

interface Tool {
  title: string;
  href: string;
  description: string;
  icon: string;
  features: string[];
  timeToImplement: string;
  timeToUse: string;
}

const tools: Tool[] = [
  {
    title: "SEO Optimizer",
    href: "/tools/seo-optimizer",
    description:
      "Boost your website's search engine ranking with our advanced SEO optimization tool. Analyze your content, get keyword suggestions, and improve your site's visibility.",
    icon: "🔍",
    features: ["Keyword analysis", "Content optimization", "Backlink checker"],
    timeToImplement: "5 min",
    timeToUse: "5 min",
  },
  {
    title: "Meta Tag Generator",
    href: "/tools/meta-tag-generator",
    description:
      "Create effective meta tags to improve your site's visibility in search results. Optimize your titles, descriptions, and keywords for better click-through rates.",
    icon: "🏷️",
    features: [
      "Custom meta tags",
      "Preview in search results",
      "Social media optimization",
    ],
    timeToImplement: "2 min",
    timeToUse: "3 min",
  },
  {
    title: "Theme Generator",
    href: "/tools/theme-generator",
    description:
      "Design beautiful, harmonious color schemes for your website with our intuitive theme generator. Create professional-looking palettes in seconds.",
    icon: "🎨",
    features: [
      "Color harmony rules",
      "Accessibility checks",
      "Export to CSS/SCSS",
    ],
    timeToImplement: "5 min",
    timeToUse: "10 min",
  },
  {
    title: "Accessibility Checker",
    href: "/tools/accessibility-checker",
    description:
      "Ensure your website is accessible to all users. Our tool checks for common accessibility issues and provides suggestions for improvement.",
    icon: "♿",
    features: [
      "WCAG compliance check",
      "Color contrast analyzer",
      "Screen reader compatibility",
    ],
    timeToImplement: "3 min",
    timeToUse: "7 min",
  },
];

interface ToolCardProps {
  tool: Tool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  return (
    <motion.div layout>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <span className="text-3xl mr-3">{tool.icon}</span>
            {tool.title}
          </CardTitle>
          <CardDescription className="text-base mt-2">
            {tool.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <h4 className="font-semibold mb-2">Key Features:</h4>
          <ul className="list-disc list-inside space-y-1">
            {tool.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          <div className="flex justify-between mt-4">
            <Badge variant="secondary" className="flex items-center">
              <Clock className="mr-1 h-3 w-3" /> {tool.timeToUse} to use
            </Badge>
            <Badge variant="secondary" className="flex items-center">
              <Clock className="mr-1 h-3 w-3" /> {tool.timeToImplement} to
              implement
            </Badge>
          </div>
        </CardContent>
        <CardFooter>
          <Link href={tool.href} passHref>
            <Button variant="ringHover" className="w-full">
              Use Tool for Free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const Tools: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredTools, setFilteredTools] = useState<Tool[]>(tools);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = tools.filter(
      (tool) =>
        tool.title.toLowerCase().includes(term) ||
        tool.description.toLowerCase().includes(term),
    );
    setFilteredTools(filtered);
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-12 mb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-4xl font-bold mb-4 text-center"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        Free Web Development Tools
      </motion.h1>
      <motion.p
        className="text-xl text-center mb-8 text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Create an account and use any tool 100% free!
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search tools..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 w-full"
          />
        </div>
      </motion.div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        layout
      >
        {filteredTools.map((tool) => (
          <ToolCard key={tool.title} tool={tool} />
        ))}
      </motion.div>
      {filteredTools.length === 0 && (
        <motion.p
          className="text-center text-gray-500 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No tools found matching your search.
        </motion.p>
      )}
      <motion.div
        className="my-12 py-12 border text-center rounded-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold mb-4">Why Choose Our Free Tools?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Zap className="mx-auto h-12 w-12 text-primary mb-2" />
            <h3 className="font-semibold mb-1">Powerful Features</h3>
            <p>Professional-grade tools at no cost</p>
          </div>
          <div>
            <Users className="mx-auto h-12 w-12 text-primary mb-2" />
            <h3 className="font-semibold mb-1">Community Trusted</h3>
            <p>Join thousands of satisfied users</p>
          </div>
          <div>
            <Star className="mx-auto h-12 w-12 text-primary mb-2" />
            <h3 className="font-semibold mb-1">Always Free</h3>
            <p>No hidden fees or surprise charges</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Tools;
