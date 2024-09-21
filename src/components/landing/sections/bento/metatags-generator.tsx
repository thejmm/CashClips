// src/components/landing/sections/bento/metatags-generator.tsx

import { AlertTriangle, Check, Copy, Eye, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

const MetatagsGenerator: React.FC = () => {
  const [metatags, setMetatags] = useState({
    title: "",
    description: "",
    url: "",
    keywords: "",
    author: "",
    ogImage: "",
    twitterCard: "summary",
    canonical: "",
    robots: "index, follow",
  });

  const [activeTab, setActiveTab] = useState("general");
  const [copied, setCopied] = useState(false);
  const [preview, setPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    validateMetatags();
  }, [metatags]);

  const validateMetatags = () => {
    const newErrors: Record<string, string> = {};
    if (metatags.title.length > 60)
      newErrors.title = "Title should be 60 characters or less";
    if (metatags.description.length > 160)
      newErrors.description = "Description should be 160 characters or less";
    if (metatags.keywords.split(",").length > 10)
      newErrors.keywords = "Use 10 keywords or less";
    if (metatags.url && !metatags.url.startsWith("http"))
      newErrors.url = "URL should start with http:// or https://";
    setErrors(newErrors);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMetatags((prev) => ({ ...prev, [name]: value }));
  };

  const generateMetatags = () =>
    `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metatags.title}</title>
    <meta name="description" content="${metatags.description}">
    <meta name="keywords" content="${metatags.keywords}">
    <meta name="author" content="${metatags.author}">
    <meta name="robots" content="${metatags.robots}">
    ${metatags.canonical ? `<link rel="canonical" href="${metatags.canonical}">` : ""}
    <meta property="og:title" content="${metatags.title}">
    <meta property="og:description" content="${metatags.description}">
    <meta property="og:url" content="${metatags.url}">
    ${metatags.ogImage ? `<meta property="og:image" content="${metatags.ogImage}">` : ""}
    <meta name="twitter:card" content="${metatags.twitterCard}">
    <meta name="twitter:title" content="${metatags.title}">
    <meta name="twitter:description" content="${metatags.description}">
    ${metatags.ogImage ? `<meta name="twitter:image" content="${metatags.ogImage}">` : ""}
</head>
<body>
    <!-- Your page content here -->
</body>
</html>
  `.trim();

  const suggestKeywords = () => {
    const suggestions = [
      "web development",
      "HTML",
      "SEO",
      "meta tags",
      "optimization",
    ];
    setMetatags((prev) => ({ ...prev, keywords: suggestions.join(", ") }));
  };

  return (
    <div className="flex flex-col bg-primary rounded-lg p-4 relative">
      <Tabs defaultValue="general" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4">
          <Input
            name="title"
            placeholder="Enter page title..."
            value={metatags.title}
            onChange={handleInputChange}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}
          <Input
            name="description"
            placeholder="Enter page description..."
            value={metatags.description}
            onChange={handleInputChange}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
          <Input
            name="url"
            placeholder="Enter page URL..."
            value={metatags.url}
            onChange={handleInputChange}
          />
          {errors.url && <p className="text-red-500 text-sm">{errors.url}</p>}
          <div className="flex items-center space-x-2">
            <Input
              name="keywords"
              placeholder="Enter keywords, comma-separated..."
              value={metatags.keywords}
              onChange={handleInputChange}
            />
            <Button onClick={suggestKeywords}>
              <RefreshCw size={16} />
            </Button>
          </div>
          {errors.keywords && (
            <p className="text-red-500 text-sm">{errors.keywords}</p>
          )}
        </TabsContent>
        <TabsContent value="social" className="space-y-4">
          <Input
            name="ogImage"
            placeholder="Enter OG Image URL..."
            value={metatags.ogImage}
            onChange={handleInputChange}
          />
          <div className="flex items-center space-x-2">
            <span>Twitter Card:</span>
            <select
              name="twitterCard"
              value={metatags.twitterCard}
              onChange={(e) =>
                setMetatags((prev) => ({
                  ...prev,
                  twitterCard: e.target.value,
                }))
              }
              className="border rounded p-1"
            >
              <option value="summary">Summary</option>
              <option value="summary_large_image">Summary Large Image</option>
              <option value="app">App</option>
              <option value="player">Player</option>
            </select>
          </div>
        </TabsContent>
        <TabsContent value="advanced" className="space-y-4">
          <Input
            name="author"
            placeholder="Enter author name..."
            value={metatags.author}
            onChange={handleInputChange}
          />
          <Input
            name="canonical"
            placeholder="Enter canonical URL..."
            value={metatags.canonical}
            onChange={handleInputChange}
          />
          <div className="flex items-center space-x-2">
            <span>Robots:</span>
            <select
              name="robots"
              value={metatags.robots}
              onChange={(e) =>
                setMetatags((prev) => ({ ...prev, robots: e.target.value }))
              }
              className="border rounded p-1"
            >
              <option value="index, follow">Index, Follow</option>
              <option value="noindex, follow">No Index, Follow</option>
              <option value="index, nofollow">Index, No Follow</option>
              <option value="noindex, nofollow">No Index, No Follow</option>
            </select>
          </div>
        </TabsContent>
      </Tabs>
      <div className="flex-1 bg-white p-4 rounded-lg overflow-auto mt-4 relative">
        <pre className="text-sm">
          <code>{generateMetatags()}</code>
        </pre>
        <AnimatePresence>
          {preview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white p-4 overflow-auto"
            >
              <h1 className="text-2xl font-bold">{metatags.title}</h1>
              <p className="text-gray-600">{metatags.description}</p>
              <p className="text-blue-500 underline">{metatags.url}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MetatagsGenerator;
