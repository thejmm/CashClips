// src/pages/tools/meta-tag-generator.tsx

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";

import AuthProtectedTool from "@/components/landing/auth/auth-protect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NextPage } from "next";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface MetaData {
  title: string;
  description: string;
  keywords: string;
  author: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
}

const MetaTagGenerator: NextPage = () => {
  const [url, setUrl] = useState("");
  const [metadata, setMetadata] = useState<MetaData>({
    title: "",
    description: "",
    keywords: "",
    author: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    twitterCard: "",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [theme, setTheme] = useState("light");
  const [includeSocialTags, setIncludeSocialTags] = useState(true);
  const [includeOpenGraph, setIncludeOpenGraph] = useState(true);
  const [generatedTags, setGeneratedTags] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSiteMetadata = async () => {
    if (!url) {
      toast.error("Please enter a URL");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/tools/metatags-fetch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMetadata(data);
      toast.success("Fetched site metadata successfully!");
    } catch (error) {
      console.error("Error fetching metadata:", error);
      toast.error("Failed to fetch metadata. Please enter manually.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateTags = () => {
    const tags = `
    <!-- Meta Tags -->
    <title>${metadata.title}</title>
    <meta name="description" content="${metadata.description}">
    <meta name="keywords" content="${metadata.keywords}">
    <meta name="author" content="${metadata.author}">
    <meta name="theme-color" content="${
      theme === "dark" ? "#000000" : "#ffffff"
    }">
    
    ${
      includeOpenGraph
        ? `
    <!-- Open Graph / Facebook -->
    <meta property="og:title" content="${metadata.ogTitle || metadata.title}">
    <meta property="og:description" content="${
      metadata.ogDescription || metadata.description
    }">
    <meta property="og:image" content="${metadata.ogImage}">
    <meta property="og:url" content="${url}">
    <meta property="og:type" content="website">
    `
        : ""
    }

    ${
      includeSocialTags
        ? `
    <!-- Twitter -->
    <meta name="twitter:card" content="${
      metadata.twitterCard || "summary_large_image"
    }">
    <meta name="twitter:title" content="${
      metadata.twitterTitle || metadata.title
    }">
    <meta name="twitter:description" content="${
      metadata.twitterDescription || metadata.description
    }">
    <meta name="twitter:image" content="${
      metadata.twitterImage || metadata.ogImage
    }">
    `
        : ""
    }
    `;

    setGeneratedTags(tags.trim());
  };

  return (
    <AuthProtectedTool>
      <div className="min-h-screen flex flex-col lg:flex-row items-start justify-center p-4 lg:p-8 space-y-8 lg:space-y-0 lg:space-x-8">
        {/* Left Panel: Meta Tag Input */}
        <motion.div
          className="flex-1 w-full lg:max-w-md space-y-2 lg:sticky top-20"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">Meta Tag Generator</h1>

          <Card>
            <CardHeader>
              <CardTitle>Check Accessibility</CardTitle>
            </CardHeader>
            <CardContent>
              <Label className="text-sm">Website URL</Label>
              <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-grow"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="w-full py-2 text-sm font-medium mt-4"
                      onClick={fetchSiteMetadata}
                      disabled={!url || isLoading}
                    >
                      {isLoading ? "Fetching..." : "Fetch Website"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Run an accessibility check on the provided URL</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              {/* Basic Meta Tags */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="basic-meta">
                  <AccordionTrigger>Basic Meta Tags</AccordionTrigger>
                  <AccordionContent className="px-2">
                    <div className="space-y-2">
                      <div>
                        <Label className="text-sm">Title</Label>
                        <Input
                          type="text"
                          value={metadata.title}
                          onChange={(e) =>
                            setMetadata({ ...metadata, title: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Description</Label>
                        <Textarea
                          value={metadata.description}
                          onChange={(e) =>
                            setMetadata({
                              ...metadata,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Keywords</Label>
                        <Input
                          type="text"
                          value={metadata.keywords}
                          onChange={(e) =>
                            setMetadata({
                              ...metadata,
                              keywords: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Author</Label>
                        <Input
                          type="text"
                          value={metadata.author}
                          onChange={(e) =>
                            setMetadata({ ...metadata, author: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Select Theme</Label>
                        <Select value={theme} onValueChange={setTheme}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Open Graph Meta Tags */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="og-meta">
                  <AccordionTrigger>Open Graph Meta Tags</AccordionTrigger>
                  <AccordionContent className="px-2">
                    <div className="space-y-2">
                      <div>
                        <Label className="text-sm">OG Title</Label>
                        <Input
                          type="text"
                          value={metadata.ogTitle}
                          onChange={(e) =>
                            setMetadata({
                              ...metadata,
                              ogTitle: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-sm">OG Description</Label>
                        <Textarea
                          value={metadata.ogDescription}
                          onChange={(e) =>
                            setMetadata({
                              ...metadata,
                              ogDescription: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-sm">OG Image URL</Label>
                        <Input
                          type="text"
                          value={metadata.ogImage}
                          onChange={(e) =>
                            setMetadata({
                              ...metadata,
                              ogImage: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Twitter Meta Tags */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="twitter-meta">
                  <AccordionTrigger>Twitter Meta Tags</AccordionTrigger>
                  <AccordionContent className="px-2">
                    <div className="space-y-2">
                      <div>
                        <Label className="text-sm">Twitter Card</Label>
                        <Select
                          value={metadata.twitterCard}
                          onValueChange={(value) =>
                            setMetadata({ ...metadata, twitterCard: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select card type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="summary">Summary</SelectItem>
                            <SelectItem value="summary_large_image">
                              Summary Large Image
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm">Twitter Title</Label>
                        <Input
                          type="text"
                          value={metadata.twitterTitle}
                          onChange={(e) =>
                            setMetadata({
                              ...metadata,
                              twitterTitle: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Twitter Description</Label>
                        <Textarea
                          value={metadata.twitterDescription}
                          onChange={(e) =>
                            setMetadata({
                              ...metadata,
                              twitterDescription: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Twitter Image URL</Label>
                        <Input
                          type="text"
                          value={metadata.twitterImage}
                          onChange={(e) =>
                            setMetadata({
                              ...metadata,
                              twitterImage: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generate Meta Tags</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {/* Switches and Selectors */}
              <div className="flex items-center space-x-2">
                <Switch
                  checked={includeSocialTags}
                  onCheckedChange={setIncludeSocialTags}
                />
                <Label className="text-sm">Include Twitter Meta Tags</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={includeOpenGraph}
                  onCheckedChange={setIncludeOpenGraph}
                />
                <Label className="text-sm">Include Open Graph Meta Tags</Label>
              </div>

              {/* Export Button */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="w-full py-2 text-sm font-medium mt-4"
                    onClick={handleGenerateTags}
                  >
                    Export Meta Tags
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Generated Meta Tags</DialogTitle>
                    <DialogDescription>
                      Copy the code below to use in your HTML.
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="h-[30rem] w-full">
                    {generatedTags && (
                      <SyntaxHighlighter
                        language="html"
                        style={vscDarkPlus}
                        showLineNumbers={true}
                        wrapLines={true}
                        className="rounded-md"
                      >
                        {generatedTags}
                      </SyntaxHighlighter>
                    )}
                  </ScrollArea>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedTags || "");
                      toast.success("Copied to clipboard!");
                    }}
                    className="mt-4 w-full py-2 text-sm font-medium"
                  >
                    Copy Code
                  </Button>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Panel: Meta Tag Preview */}
        <motion.div
          className="flex-1 w-full lg:max-w-md space-y-4 "
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold">Preview</h2>
          <Separator />
          <div className="space-y-8">
            {/* Google Preview */}
            <div className="border rounded p-4">
              <h3 className="font-semibold">Google</h3>
              <div className="mt-4">
                <a
                  href={url || "#"}
                  className="text-xl font-bold text-blue-500 hover:underline"
                >
                  {metadata.title || "Title will appear here"}
                </a>
                <p className="text-sm">{url || "https://example.com"}</p>
                <p className="text-sm mt-1">
                  {metadata.description || "Description will appear here"}
                </p>
              </div>
            </div>

            {/* Twitter Preview */}
            <div className="border rounded p-4">
              <h3 className="font-semibold">Twitter</h3>
              <div className="mt-4 border rounded-lg overflow-hidden">
                <img
                  src={
                    imagePreview ||
                    metadata.twitterImage ||
                    "https://placehold.co/600x315?text=Twitter+Card+Image&font=roboto"
                  }
                  alt="Twitter Card"
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <p className="text-lg font-bold">
                    {metadata.twitterTitle ||
                      metadata.title ||
                      "Title will appear here"}
                  </p>
                  <p className="text-sm">
                    {metadata.twitterDescription ||
                      metadata.description ||
                      "Description will appear here"}
                  </p>
                  <p className="text-xs mt-2">{url || "example.com"}</p>
                </div>
              </div>
            </div>

            {/* Facebook Preview */}
            <div className="border rounded p-4">
              <h3 className="font-semibold">Facebook</h3>
              <div className="mt-4 border rounded-lg overflow-hidden">
                <img
                  src={
                    imagePreview ||
                    metadata.ogImage ||
                    "https://placehold.co/1200x628?text=Facebook+Card+Image&font=roboto"
                  }
                  alt="Facebook Card"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <p className="text-xs uppercase">
                    {url?.replace(/^https?:\/\//, "") || "example.com"}
                  </p>
                  <p className="text-lg font-bold">
                    {metadata.ogTitle ||
                      metadata.title ||
                      "Title will appear here"}
                  </p>
                  <p className="text-sm mt-1">
                    {metadata.ogDescription ||
                      metadata.description ||
                      "Description will appear here"}
                  </p>
                </div>
              </div>
            </div>

            {/* LinkedIn Preview */}
            <div className="border rounded p-4">
              <h3 className="font-semibold">LinkedIn</h3>
              <div className="mt-4 border rounded-lg overflow-hidden">
                <img
                  src={
                    imagePreview ||
                    metadata.ogImage ||
                    "https://placehold.co/1200x627?text=LinkedIn+Card+Image&font=roboto"
                  }
                  alt="LinkedIn Card"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <p className="text-xs">
                    {url?.replace(/^https?:\/\//, "") || "example.com"}
                  </p>
                  <p className="text-lg font-bold">
                    {metadata.ogTitle ||
                      metadata.title ||
                      "Title will appear here"}
                  </p>
                  <p className="text-sm mt-1">
                    {metadata.ogDescription ||
                      metadata.description ||
                      "Description will appear here"}
                  </p>
                </div>
              </div>
            </div>

            {/* Pinterest Preview */}
            <div className="border rounded p-4">
              <h3 className="font-semibold">Pinterest</h3>
              <div className="mt-4 border rounded-lg overflow-hidden">
                <img
                  src={
                    imagePreview ||
                    metadata.ogImage ||
                    "https://placehold.co/600x600?text=Pinterest+Card+Image&font=roboto"
                  }
                  alt="Pinterest Card"
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <p className="text-lg font-bold">
                    {metadata.ogTitle ||
                      metadata.title ||
                      "Title will appear here"}
                  </p>
                  <p className="text-sm">
                    {metadata.ogDescription ||
                      metadata.description ||
                      "Description will appear here"}
                  </p>
                </div>
              </div>
            </div>

            {/* Slack Preview */}
            <div className="border rounded p-4">
              <h3 className="font-semibold">Slack</h3>
              <div className="mt-4 border rounded-lg overflow-hidden">
                <div className="p-4">
                  <p className="text-base font-semibold">
                    {metadata.ogTitle ||
                      metadata.title ||
                      "Title will appear here"}
                  </p>
                  <p className="text-sm mt-1">
                    {metadata.ogDescription ||
                      metadata.description ||
                      "Description will appear here"}
                  </p>
                </div>
                <img
                  src={
                    imagePreview ||
                    metadata.ogImage ||
                    "https://placehold.co/800x418?text=Slack+Card+Image&font=roboto"
                  }
                  alt="Slack Card"
                  className="w-full h-36 object-cover"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AuthProtectedTool>
  );
};

export default MetaTagGenerator;
