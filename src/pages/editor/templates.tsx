// src/pages/editor/templates.tsx

import { ArrowRight, Clock, Search, Star, Users, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

// Utility function to generate custom placeholder URLs
const generatePlaceholder = (width: number, height: number, text: string) =>
  `https://placehold.co/${width}x${height}?text=${text.replace(
    /\s/g,
    "+",
  )}&font=roboto`;

interface Template {
  id: string;
  name: string;
  description: string;
  features: string[];
  techStack: string[];
  images: string[];
}

const templates = [
  {
    id: "developer-portfolio",
    name: "Advanced Developer Portfolio",
    description:
      "Showcase your skills and projects with an advanced portfolio layout.",
    features: [
      "Animated Hero Section",
      "Detailed About Section with Timeline",
      "Interactive Work Experience Section",
      "Education and Certifications",
      "Dynamic Projects Showcase",
      "Interactive Hackathon and Achievements Timeline",
      "Contact Form with Validation",
      "Integrated Blog with MDX",
    ],
    techStack: [
      "Next.js",
      "React",
      "TypeScript",
      "TailwindCSS",
      "Framer Motion",
      "shadcn/ui",
      "Magic UI",
    ],
    images: [
      generatePlaceholder(600, 400, "Portfolio Preview 1"),
      generatePlaceholder(600, 400, "Portfolio Preview 2"),
      generatePlaceholder(600, 400, "Portfolio Preview 3"),
    ],
  },
];

interface TemplateCardProps {
  template: Template;
  onViewDetails: (template: Template) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onViewDetails,
}) => {
  return (
    <motion.div layout>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-2xl">{template.name}</CardTitle>
          <CardDescription className="text-base mt-2">
            {template.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <h4 className="font-semibold mb-2">Key Features:</h4>
          <ul className="list-disc list-inside space-y-1">
            {template.features.slice(0, 3).map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
            {template.features.length > 3 && <li>And more...</li>}
          </ul>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="ringHover"
            onClick={() => onViewDetails(template)}
            className="w-full"
          >
            View Template <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const Templates: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredTemplates, setFilteredTemplates] =
    useState<Template[]>(templates);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = templates.filter(
      (template) =>
        template.name.toLowerCase().includes(term) ||
        template.description.toLowerCase().includes(term),
    );
    setFilteredTemplates(filtered);
  };

  const handleViewDetails = (template: Template) => {
    setSelectedTemplate(template);
  };

  const handleCloseDialog = () => {
    setSelectedTemplate(null);
  };

  return (
    <motion.div
      className="min-h-screen container mx-auto px-4 py-12 mb-12"
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
        Explore Our Advanced Templates
      </motion.h1>
      <motion.p
        className="text-xl text-center mb-8 text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Edit, customize, and export any template in our built-in editor!
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
            placeholder="Search templates..."
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
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onViewDetails={handleViewDetails}
          />
        ))}
      </motion.div>
      {filteredTemplates.length === 0 && (
        <motion.p
          className="text-center text-gray-500 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No templates found matching your search.
        </motion.p>
      )}
      <motion.div
        className="my-12 py-12 border text-center rounded-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold mb-4">Why Choose Our Templates?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Zap className="mx-auto h-12 w-12 text-primary mb-2" />
            <h3 className="font-semibold mb-1">Highly Customizable</h3>
            <p>Modify every detail to suit your project needs.</p>
          </div>
          <div>
            <Users className="mx-auto h-12 w-12 text-primary mb-2" />
            <h3 className="font-semibold mb-1">Community Approved</h3>
            <p>Trusted by thousands of developers worldwide.</p>
          </div>
          <div>
            <Star className="mx-auto h-12 w-12 text-primary mb-2" />
            <h3 className="font-semibold mb-1">Build with Ease</h3>
            <p>Create and edit templates in just a few clicks.</p>
          </div>
        </div>
      </motion.div>

      {selectedTemplate && (
        <Dialog open={!!selectedTemplate} onOpenChange={handleCloseDialog}>
          <DialogContent className="w-full max-w-5xl">
            <div className="flex flex-col md:flex-row h-full">
              {/* Left Side: Sticky Navigation/Details */}
              <div className="md:w-1/3 flex-shrink-0 md:sticky top-0 self-start p-4 ">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold mb-4">
                    {selectedTemplate.name}
                  </DialogTitle>
                </DialogHeader>
                <p className="text-muted-foreground mb-6">
                  {selectedTemplate.description}
                </p>
                <Link href={"/editor/project/" + selectedTemplate.id}>
                  <Button variant="ringHover" className="w-full mt-4">
                    Edit Template in Editor
                  </Button>
                </Link>
              </div>

              {/* Right Side: Scrollable Content */}
              <ScrollArea className="md:w-2/3 p-4 space-y-6 h-[50vh] md:h-[90vh]">
                <h4 className="font-semibold">Preview Images:</h4>
                <div className="grid grid-cols-1 gap-4">
                  {selectedTemplate.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${selectedTemplate.name} preview ${index + 1}`}
                      className="rounded-lg shadow-lg"
                    />
                  ))}
                </div>
                <h4 className="font-semibold">Features:</h4>
                <ul className="list-disc list-inside space-y-1 mb-4">
                  {selectedTemplate.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <h4 className="font-semibold mb-2">Tech Stack:</h4>
                <ul className="list-disc list-inside space-y-1 mb-4">
                  {selectedTemplate.techStack.map((tech, index) => (
                    <li key={index}>{tech}</li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
};

export default Templates;
