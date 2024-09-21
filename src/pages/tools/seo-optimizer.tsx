// src/pages/tools/seo-optimizer.tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader, Terminal } from "lucide-react";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import AuthProtectedTool from "@/components/landing/auth/auth-protect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NextPage } from "next";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface AdvancedSEOAnalysisResult {
  contentAnalysis: {
    title: string;
    description: string;
    h1: string[];
    h2: string[];
    wordCount: number;
    keywordDensity: number;
    readabilityScore: number;
    contentQuality: {
      paragraphCount: number;
      sentenceCount: number;
      averageSentenceLength: number;
      longSentences: number;
      passiveVoiceCount: number;
      transitionWords: string[];
      uniqueWords: number;
      lexicalDensity: number;
    };
    topicCoverage: string[];
    contentGaps: string[];
    sentiment: number;
    entityAnalysis: { [entity: string]: number };
  };
  technicalSEO: {
    loadTime: number;
    mobileResponsive: boolean;
    httpsEnabled: boolean;
    robotsTxt: {
      exists: boolean;
      content: string;
    };
    sitemapXml: {
      exists: boolean;
      url: string;
    };
    canonicalTag: string | null;
    structuredData: any[];
    hreflangTags: { lang: string; url: string }[];
    securityHeaders: { [header: string]: string | undefined };
    compressionEnabled: boolean;
    serverSignature: string | null;
  };
  linkAnalysis: {
    internalLinks: string[];
    externalLinks: string[];
    brokenLinks: string[];
    anchorTextDistribution: { [key: string]: number };
  };
  imageOptimization: {
    totalImages: number;
    unoptimizedImages: number;
  };
  javascriptUsage: {
    totalScripts: number;
    asyncScripts: number;
    deferScripts: number;
  };
  contentStructure: {
    headings: { [key: string]: number };
    listItems: number;
  };
  socialMetaTags: { [key: string]: string | null };
  schemaMarkup: string[];
  textToHTMLRatio: number;
  duplicateContent: { [selector: string]: number };
  urlStructure: {
    protocol: string;
    domain: string;
    path: string;
    queryParams: string;
  };
  pageSpeed: {
    score: number;
    suggestions: string[];
  };
  keywordSuggestions: string[];
  readabilityAnalysis: {
    score: number;
    level: string;
  };
  keywordPlacement: {
    title: boolean;
    description: boolean;
    headings: boolean;
    firstParagraph: boolean;
  };
  suggestions: {
    type: "critical" | "warning" | "improvement" | "good";
    category: string;
    title: string;
    description: string;
  }[];
}

const mapSuggestionTypeToAlertVariant = (
  type: "critical" | "warning" | "improvement" | "good",
): "error" | "warning" | "info" | "success" => {
  switch (type) {
    case "critical":
      return "error";
    case "warning":
      return "warning";
    case "improvement":
      return "info";
    case "good":
      return "success";
  }
};

const SEOOptimizer: NextPage = () => {
  const [url, setUrl] = useState("");
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<AdvancedSEOAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!url) {
      toast.error("Please enter a URL");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/tools/seo-analyzer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, keyword }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setAnalysisResult(result);
      toast.success("SEO analysis completed successfully!");
    } catch (error) {
      console.error("Error analyzing SEO:", error);
      toast.error("Failed to analyze SEO. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthProtectedTool>
      <div className="min-h-screen flex flex-col lg:flex-row items-start justify-center p-4 lg:p-8 space-y-8 lg:space-y-0 lg:space-x-8">
        {/* Left Panel: SEO Input and Information */}
        <motion.div
          className="flex-1 w-full lg:max-w-md space-y-4 lg:sticky top-20"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">SEO Optimizer</h1>

          <Card>
            <CardHeader>
              <CardTitle>Analyze SEO</CardTitle>
            </CardHeader>
            <CardContent>
              <Label className="text-sm">Website URL</Label>
              <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full"
              />
              <Label className="text-sm mt-4">Focus Keyword</Label>
              <Input
                type="text"
                placeholder="Enter primary keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="w-full py-2 text-sm font-medium mt-4"
                      onClick={handleAnalyze}
                      disabled={!keyword || !url || isLoading}
                    >
                      {isLoading ? "Fetching..." : "Fetch Website"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Run an SEO analysis on the provided URL</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="what-is-seo">
                  <AccordionTrigger>What is SEO?</AccordionTrigger>
                  <AccordionContent>
                    SEO (Search Engine Optimization) is the practice of
                    improving the quality and quantity of website traffic to a
                    website from search engines.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="why-important">
                  <AccordionTrigger>Why is SEO important?</AccordionTrigger>
                  <AccordionContent>
                    SEO helps increase the visibility of your website in search
                    engine results, driving more organic traffic and potentially
                    improving your businesss online presence.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="on-page-off-page">
                  <AccordionTrigger>
                    What are on-page and off-page SEO?
                  </AccordionTrigger>
                  <AccordionContent>
                    On-page SEO refers to optimizations you can make directly on
                    your website, such as content quality and meta tags.
                    Off-page SEO involves external factors like backlinks and
                    social media presence.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Did You Know?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                SEO is constantly evolving, and staying updated with best
                practices can significantly impact your sites ranking and
                traffic.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Panel: Enhanced SEO Analysis Results */}
        <motion.div
          className="flex-1 w-full lg:max-w-2xl space-y-4"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold">SEO Analysis</h2>
          <Separator />
          <AnimatePresence>
            {analysisResult ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>SEO Improvement Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analysisResult.suggestions.map((suggestion, index) => (
                      <Alert
                        key={index}
                        variant={mapSuggestionTypeToAlertVariant(
                          suggestion.type,
                        )}
                        className="mb-2"
                      >
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>{suggestion.title}</AlertTitle>
                        <AlertDescription>
                          {suggestion.description}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Page Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <strong>Title:</strong>{" "}
                      {analysisResult?.contentAnalysis?.title || "N/A"}
                    </p>
                    <p>
                      <strong>Description:</strong>{" "}
                      {analysisResult?.contentAnalysis?.description || "N/A"}
                    </p>
                    <p>
                      <strong>Word Count:</strong>{" "}
                      {analysisResult?.contentAnalysis?.wordCount || "N/A"}
                    </p>
                    <p>
                      <strong>Keyword Density:</strong>{" "}
                      {analysisResult?.contentAnalysis?.keywordDensity?.toFixed(
                        2,
                      )}
                      %
                    </p>
                    <p>
                      <strong>Readability Score:</strong>{" "}
                      {analysisResult?.contentAnalysis?.readabilityScore?.toFixed(
                        2,
                      ) || "N/A"}
                    </p>
                    <p>
                      <strong>Load Time:</strong>{" "}
                      {analysisResult?.technicalSEO?.loadTime}ms
                    </p>
                    <p>
                      <strong>Mobile Responsive:</strong>{" "}
                      {analysisResult?.technicalSEO?.mobileResponsive
                        ? "Yes"
                        : "No"}
                    </p>
                    <p>
                      <strong>HTTPS Enabled:</strong>{" "}
                      {analysisResult?.technicalSEO?.httpsEnabled
                        ? "Yes"
                        : "No"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Content Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <strong>Paragraph Count:</strong>{" "}
                      {analysisResult?.contentAnalysis?.contentQuality
                        ?.paragraphCount || "N/A"}
                    </p>
                    <p>
                      <strong>Sentence Count:</strong>{" "}
                      {analysisResult?.contentAnalysis?.contentQuality
                        ?.sentenceCount || "N/A"}
                    </p>
                    <p>
                      <strong>Average Sentence Length:</strong>{" "}
                      {analysisResult?.contentAnalysis?.contentQuality?.averageSentenceLength?.toFixed(
                        2,
                      ) || "N/A"}
                    </p>
                    <p>
                      <strong>Long Sentences:</strong>{" "}
                      {analysisResult?.contentAnalysis?.contentQuality
                        ?.longSentences || "N/A"}
                    </p>
                    <p>
                      <strong>Unique Words:</strong>{" "}
                      {analysisResult?.contentAnalysis?.contentQuality
                        ?.uniqueWords || "N/A"}
                    </p>
                    <p>
                      <strong>Lexical Density:</strong>{" "}
                      {analysisResult?.contentAnalysis?.contentQuality?.lexicalDensity?.toFixed(
                        2,
                      )}
                      %
                    </p>
                    <p>
                      <strong>Topic Coverage:</strong>{" "}
                      {analysisResult?.contentAnalysis?.topicCoverage?.join(
                        ", ",
                      ) || "N/A"}
                    </p>
                    <p>
                      <strong>Content Gaps:</strong>{" "}
                      {analysisResult?.contentAnalysis?.contentGaps?.join(
                        ", ",
                      ) || "N/A"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Technical SEO</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <strong>HTTPS Enabled:</strong>{" "}
                      {analysisResult?.technicalSEO?.httpsEnabled
                        ? "Yes"
                        : "No"}
                    </p>
                    <p>
                      <strong>Mobile Responsive:</strong>{" "}
                      {analysisResult?.technicalSEO?.mobileResponsive
                        ? "Yes"
                        : "No"}
                    </p>
                    <p>
                      <strong>Robots.txt Exists:</strong>{" "}
                      {analysisResult?.technicalSEO?.robotsTxt?.exists
                        ? "Yes"
                        : "No"}
                    </p>
                    <p>
                      <strong>Sitemap Exists:</strong>{" "}
                      {analysisResult?.technicalSEO?.sitemapXml?.exists
                        ? "Yes"
                        : "No"}
                    </p>
                    <p>
                      <strong>Canonical Tag:</strong>{" "}
                      {analysisResult?.technicalSEO?.canonicalTag || "N/A"}
                    </p>
                    <p>
                      <strong>Security Headers:</strong>{" "}
                      {JSON.stringify(
                        analysisResult?.technicalSEO?.securityHeaders,
                        null,
                        2,
                      )}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <strong>Load Time:</strong>{" "}
                      {analysisResult?.technicalSEO?.loadTime || "N/A"}ms
                    </p>
                    <p>
                      <strong>Compression Enabled:</strong>{" "}
                      {analysisResult?.technicalSEO?.compressionEnabled
                        ? "Yes"
                        : "No"}
                    </p>
                    <p>
                      <strong>Server Signature:</strong>{" "}
                      {analysisResult?.technicalSEO?.serverSignature || "N/A"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Link Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <strong>Internal Links:</strong>{" "}
                      {analysisResult?.linkAnalysis?.internalLinks?.length ||
                        "N/A"}
                    </p>
                    <p>
                      <strong>External Links:</strong>{" "}
                      {analysisResult?.linkAnalysis?.externalLinks?.length ||
                        "N/A"}
                    </p>
                    <p>
                      <strong>Broken Links:</strong>{" "}
                      {analysisResult?.linkAnalysis?.brokenLinks?.length ||
                        "N/A"}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {isLoading ? (
                  <Alert variant="info">
                    <Loader className="animate-spin w-6 h-6" />
                    <AlertTitle>Analyzing</AlertTitle>
                    <AlertDescription className="flex items-center space-x-2">
                      Fetching SEO results...
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="info">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>No SEO Results</AlertTitle>
                    <AlertDescription>
                      Enter a URL and click Analyze Website to see comprehensive
                      SEO results.
                    </AlertDescription>
                  </Alert>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AuthProtectedTool>
  );
};

export default SEOOptimizer;
