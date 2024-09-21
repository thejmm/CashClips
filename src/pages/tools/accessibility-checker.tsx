// src/pages/tools/accessibility-checker.tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle,
  FileWarning,
  HelpCircle,
  Info,
  Loader,
  Terminal,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useCallback, useState } from "react";
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

interface AccessibilityIssue {
  type: "default" | "info" | "success" | "warning" | "error" | "destructive";
  title: string;
  description: string;
  impact: "minor" | "moderate" | "serious" | "critical";
  wcagCriteria?: string[];
}

interface AnalysisResult {
  issues: AccessibilityIssue[];
  groupedIssues: Record<string, AccessibilityIssue[]>;
  score: number;
  summary: {
    total: number;
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  };
}

const AccessibilityChecker: NextPage = () => {
  const [url, setUrl] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const runAccessibilityChecks = useCallback(async () => {
    if (!url) {
      toast.error("Please enter a valid URL");
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setError(null);
    setAnalysisResult(null);

    const updateProgress = () => {
      setProgress((prev) => Math.min(prev + 10, 90));
    };

    const progressInterval = setInterval(updateProgress, 500);

    try {
      const response = await fetch("/api/tools/accessibility-checker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze accessibility");
      }

      const result: AnalysisResult = await response.json();
      setAnalysisResult(result);
      toast.success("Accessibility analysis completed!");
    } catch (error) {
      setError("Failed to analyze accessibility. Please try again.");
      toast.error("Failed to analyze accessibility.");
    } finally {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      setProgress(100);
    }
  }, [url]);

  const renderIssueIcon = (type: AccessibilityIssue["type"]) => {
    switch (type) {
      case "default":
        return <Terminal className="h-4 w-4" />;
      case "info":
        return <Info className="h-4 w-4" />;
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "error":
        return <XCircle className="h-4 w-4" />;
      case "destructive":
        return <AlertOctagon className="h-4 w-4" />;
    }
  };

  const renderScoreBadge = (score: number) => {
    let color = "bg-red-500";
    if (score >= 90) color = "bg-green-500";
    else if (score >= 70) color = "bg-yellow-500";
    else if (score >= 50) color = "bg-orange-500";

    return (
      <div
        className={`${color} text-white font-bold rounded-full p-2 w-16 h-16 flex items-center justify-center`}
      >
        {score}
      </div>
    );
  };

  return (
    <AuthProtectedTool>
      <div className="min-h-screen flex flex-col lg:flex-row items-start justify-center p-4 lg:p-8 space-y-8 lg:space-y-0 lg:space-x-8">
        {/* Left Panel: Input and Information */}
        <motion.div
          className="flex-1 w-full lg:max-w-md space-y-2 lg:sticky top-20"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">Accessibility Checker</h1>

          <Card>
            <CardHeader>
              <CardTitle>Check Accessibility</CardTitle>
            </CardHeader>
            <CardContent>
              <Label className="text-sm" htmlFor="url-input">
                Website URL
              </Label>
              <Input
                id="url-input"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-grow"
                disabled={isAnalyzing}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={runAccessibilityChecks}
                      disabled={!url || isAnalyzing}
                      className="w-full py-2 text-sm font-medium mt-4"
                    >
                      {isAnalyzing ? "Fetching..." : "Fetch Website"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Run an accessibility check on the provided URL</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardContent>
          </Card>

          {isAnalyzing && (
            <Card>
              <CardContent className="flex justify-center items-center py-6">
                <Loader className="animate-spin w-6 h-6" />
              </CardContent>
            </Card>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertOctagon className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="what-is-accessibility">
                  <AccordionTrigger>
                    What is web accessibility?
                  </AccordionTrigger>
                  <AccordionContent>
                    Web accessibility ensures that websites are usable by people
                    with disabilities, including visual, auditory, physical,
                    speech, cognitive, and neurological disabilities.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="why-important">
                  <AccordionTrigger>
                    Why is accessibility important?
                  </AccordionTrigger>
                  <AccordionContent>
                    Accessibility provides equal access to information, improves
                    user experience for all, and often complies with legal
                    requirements.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="wcag-criteria">
                  <AccordionTrigger>What are WCAG criteria?</AccordionTrigger>
                  <AccordionContent>
                    WCAG (Web Content Accessibility Guidelines) are
                    recommendations for making web content more accessible,
                    organized under four principles: Perceivable, Operable,
                    Understandable, and Robust.
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
                Over 1 billion people worldwide have some form of disability.
                Making your website accessible improves usability for everyone
                and can boost SEO.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Panel: Accessibility Issues and Results */}
        <motion.div
          className="flex-1 w-full lg:max-w-md space-y-4 "
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold">Accessibility Results</h2>
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
                    <CardTitle>Overall Score</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center">
                    <p className="text-2xl font-bold">
                      Score: {analysisResult.score}
                    </p>
                    {renderScoreBadge(analysisResult.score)}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Analysis Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Total Issues: {analysisResult.summary.total}</p>
                    <p>Critical: {analysisResult.summary.critical}</p>
                    <p>Serious: {analysisResult.summary.serious}</p>
                    <p>Moderate: {analysisResult.summary.moderate}</p>
                    <p>Minor: {analysisResult.summary.minor}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>WCAG Criteria Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {Object.entries(analysisResult.groupedIssues).map(
                        ([criteria, issues]) => (
                          <AccordionItem value={criteria} key={criteria}>
                            <AccordionTrigger>{criteria}</AccordionTrigger>
                            <AccordionContent>
                              <p>{issues.length} issue(s) found</p>
                            </AccordionContent>
                          </AccordionItem>
                        ),
                      )}
                    </Accordion>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Issues</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analysisResult.issues.map((issue, index) => (
                      <Accordion type="single" collapsible key={index}>
                        <AccordionItem value={`item-${index}`}>
                          <AccordionTrigger>
                            <Alert variant={issue.type}>
                              {renderIssueIcon(issue.type)}
                              <AlertTitle>{issue.title}</AlertTitle>
                            </Alert>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="p-4 space-y-2">
                              <p>{issue.description}</p>
                              <p>
                                <strong>Impact:</strong> {issue.impact}
                              </p>
                              {issue.wcagCriteria && (
                                <p>
                                  <strong>WCAG Criteria:</strong>{" "}
                                  {issue.wcagCriteria.join(", ")}
                                </p>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Alert variant="info">
                  <FileWarning className="h-4 w-4" />
                  <AlertTitle>No Accessibility Results</AlertTitle>
                  <AlertDescription>
                    Enter a URL and click fetch website to see results.
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AuthProtectedTool>
  );
};

export default AccessibilityChecker;
