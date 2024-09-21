// src/pages/api/tools/accessibility-checker.ts

import { HTMLElement, parse } from "node-html-parser";
import { NextApiRequest, NextApiResponse } from "next";

interface AccessibilityIssue {
  type: "default" | "info" | "success" | "warning" | "error" | "destructive";
  title: string;
  description: string;
  impact: "minor" | "moderate" | "serious" | "critical";
  wcagCriteria?: string[];
}

const analyzeHeadings = (root: HTMLElement): AccessibilityIssue[] => {
  const issues: AccessibilityIssue[] = [];
  const headings = root.querySelectorAll("h1, h2, h3, h4, h5, h6");
  let previousLevel = 0;
  let h1Count = 0;

  headings.forEach((heading, index) => {
    const currentLevel = parseInt(heading.tagName.charAt(1));

    if (currentLevel === 1) h1Count++;

    if (index === 0 && currentLevel !== 1) {
      issues.push({
        type: "error",
        title: "First Heading is not h1",
        description: "The first heading on the page should be an h1 element.",
        impact: "serious",
        wcagCriteria: ["1.3.1", "2.4.6"],
      });
    }

    if (currentLevel - previousLevel > 1) {
      issues.push({
        type: "warning",
        title: "Skipped Heading Level",
        description: `Heading levels should not be skipped. Found h${currentLevel} after h${previousLevel}.`,
        impact: "moderate",
        wcagCriteria: ["1.3.1", "2.4.6"],
      });
    }

    previousLevel = currentLevel;
  });

  if (h1Count === 0) {
    issues.push({
      type: "error",
      title: "Missing Main Heading",
      description:
        "The page should have one main heading (h1) that describes its overall purpose.",
      impact: "serious",
      wcagCriteria: ["1.3.1", "2.4.6"],
    });
  } else if (h1Count > 1) {
    issues.push({
      type: "warning",
      title: "Multiple Main Headings",
      description: `Found ${h1Count} h1 elements. There should typically be only one main heading per page.`,
      impact: "moderate",
      wcagCriteria: ["1.3.1", "2.4.6"],
    });
  }

  return issues;
};

const analyzeImages = (root: HTMLElement): AccessibilityIssue[] => {
  const issues: AccessibilityIssue[] = [];
  const images = root.querySelectorAll("img");

  images.forEach((img) => {
    if (!img.getAttribute("alt")) {
      issues.push({
        type: "error",
        title: "Image Missing Alt Text",
        description: "Image elements must have an alt attribute.",
        impact: "critical",
        wcagCriteria: ["1.1.1"],
      });
    }
  });

  return issues;
};

const analyzeLinks = (root: HTMLElement): AccessibilityIssue[] => {
  const issues: AccessibilityIssue[] = [];
  const links = root.querySelectorAll("a");

  links.forEach((link) => {
    const linkText = link.textContent.trim().toLowerCase();
    if (
      linkText === "click here" ||
      linkText === "read more" ||
      linkText === "learn more"
    ) {
      issues.push({
        type: "warning",
        title: "Non-descriptive Link Text",
        description:
          "Link text should be descriptive and provide context about its destination.",
        impact: "moderate",
        wcagCriteria: ["2.4.4", "2.4.9"],
      });
    }

    if (!link.getAttribute("href") || link.getAttribute("href") === "#") {
      issues.push({
        type: "error",
        title: "Empty or Invalid Href",
        description: "Links should have valid href attributes.",
        impact: "serious",
        wcagCriteria: ["2.1.1", "4.1.2"],
      });
    }
  });

  return issues;
};

const analyzeColorContrast = (root: HTMLElement): AccessibilityIssue[] => {
  // Note: Accurate color contrast analysis requires browser rendering.
  // This is a simplified check that looks for potential issues.
  const issues: AccessibilityIssue[] = [];
  const elements = root.querySelectorAll("*");

  elements.forEach((el) => {
    const style = el.getAttribute("style");
    if (style && (style.includes("color") || style.includes("background"))) {
      issues.push({
        type: "warning",
        title: "Potential Color Contrast Issue",
        description:
          "Inline styles affecting text color or background detected. Ensure sufficient contrast.",
        impact: "moderate",
        wcagCriteria: ["1.4.3"],
      });
    }
  });

  return issues;
};

const analyzeFormLabels = (root: HTMLElement): AccessibilityIssue[] => {
  const issues: AccessibilityIssue[] = [];
  const formControls = root.querySelectorAll("input, select, textarea");

  formControls.forEach((control) => {
    const id = control.getAttribute("id");
    const label = id ? root.querySelector(`label[for="${id}"]`) : null;

    if (
      !label &&
      !control.getAttribute("aria-label") &&
      !control.getAttribute("aria-labelledby")
    ) {
      issues.push({
        type: "error",
        title: "Form Control Without Label",
        description:
          "All form controls should have an associated label or appropriate ARIA attributes.",
        impact: "serious",
        wcagCriteria: ["1.3.1", "3.3.2"],
      });
    }
  });

  return issues;
};

const analyzePageTitle = (root: HTMLElement): AccessibilityIssue[] => {
  const issues: AccessibilityIssue[] = [];
  const titleElement = root.querySelector("title");

  if (!titleElement || !titleElement.textContent.trim()) {
    issues.push({
      type: "error",
      title: "Missing Page Title",
      description: "The page should have a descriptive title.",
      impact: "serious",
      wcagCriteria: ["2.4.2"],
    });
  }

  return issues;
};

const analyzeLanguageDeclaration = (
  root: HTMLElement,
): AccessibilityIssue[] => {
  const issues: AccessibilityIssue[] = [];
  const htmlElement = root.querySelector("html");

  if (!htmlElement || !htmlElement.getAttribute("lang")) {
    issues.push({
      type: "error",
      title: "Missing Language Declaration",
      description:
        "The page should have a language declared on the <html> element.",
      impact: "serious",
      wcagCriteria: ["3.1.1"],
    });
  }

  return issues;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { htmlContent, url } = req.body;

  if (!htmlContent && !url) {
    return res
      .status(400)
      .json({ message: "Either HTML content or URL is required" });
  }

  try {
    let parsedHtml: HTMLElement;

    if (htmlContent) {
      parsedHtml = parse(htmlContent);
    } else {
      // Fetch HTML content from URL
      const response = await fetch(url);
      const fetchedHtml = await response.text();
      parsedHtml = parse(fetchedHtml);
    }

    // Run all checks
    const issues: AccessibilityIssue[] = [
      ...analyzeHeadings(parsedHtml),
      ...analyzeImages(parsedHtml),
      ...analyzeLinks(parsedHtml),
      ...analyzeColorContrast(parsedHtml),
      ...analyzeFormLabels(parsedHtml),
      ...analyzePageTitle(parsedHtml),
      ...analyzeLanguageDeclaration(parsedHtml),
    ];

    // Sort issues by impact
    const sortOrder = { critical: 0, serious: 1, moderate: 2, minor: 3 };
    issues.sort((a, b) => sortOrder[a.impact] - sortOrder[b.impact]);

    // Group issues by WCAG criteria
    const groupedIssues = issues.reduce(
      (acc, issue) => {
        (issue.wcagCriteria || []).forEach((criteria) => {
          if (!acc[criteria]) {
            acc[criteria] = [];
          }
          acc[criteria].push(issue);
        });
        return acc;
      },
      {} as Record<string, AccessibilityIssue[]>,
    );

    // Calculate overall accessibility score
    const maxScore = 100;
    const deductions = {
      critical: 20,
      serious: 10,
      moderate: 5,
      minor: 2,
    };
    let score = maxScore;
    for (const issue of issues) {
      score -= deductions[issue.impact] || 0;
    }
    score = Math.max(0, score);

    return res.status(200).json({
      issues,
      groupedIssues,
      score,
      summary: {
        total: issues.length,
        critical: issues.filter((i) => i.impact === "critical").length,
        serious: issues.filter((i) => i.impact === "serious").length,
        moderate: issues.filter((i) => i.impact === "moderate").length,
        minor: issues.filter((i) => i.impact === "minor").length,
      },
    });
  } catch (error) {
    console.error("Error analyzing accessibility:", error);
    return res.status(500).json({ message: "Error analyzing accessibility" });
  }
}
