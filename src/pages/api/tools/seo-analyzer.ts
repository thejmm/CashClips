// src/pages/api/tools/seo-analyzer.ts
import { NextApiRequest, NextApiResponse } from "next";

import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import { URL } from "url";
import https from "https";

// TypeScript interface for the result of the SEO analysis
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
  suggestions: {
    type: "critical" | "warning" | "improvement" | "good";
    category: string;
    title: string;
    description: string;
  }[];
}

// Helper function to fetch a URL's HTML and headers
async function fetchUrl(url: string): Promise<{ html: string; headers: any }> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve({ html: data, headers: res.headers });
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

// Main handler function for the API
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url, keyword } = req.body;

  if (
    !url ||
    typeof url !== "string" ||
    !keyword ||
    typeof keyword !== "string"
  ) {
    return res.status(400).json({ error: "Invalid URL or keyword provided" });
  }

  try {
    const result = await performAdvancedSEOAnalysis(url, keyword);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error analyzing SEO:", error);
    return res.status(500).json({ error: "Error analyzing SEO" });
  }
}

// Main function to perform SEO analysis
async function performAdvancedSEOAnalysis(
  url: string,
  keyword: string,
): Promise<AdvancedSEOAnalysisResult> {
  const startTime = Date.now();
  const { html, headers } = await fetchUrl(url);
  const loadTime = Date.now() - startTime;

  const dom = new JSDOM(html);
  const document = dom.window.document;

  const reader = new Readability(document);
  const article = reader.parse();

  const contentAnalysis = analyzeContent(document, keyword, article);
  const technicalSEO = await analyzeTechnicalSEO(
    url,
    document,
    headers,
    loadTime,
  );
  const linkAnalysis = analyzeLinkStructure(document, url);

  const suggestions = generateAdvancedSuggestions({
    contentAnalysis,
    technicalSEO,
    linkAnalysis,
  });

  return {
    contentAnalysis,
    technicalSEO,
    linkAnalysis,
    suggestions,
  };
}

// Function to analyze the content of the page
function analyzeContent(
  document: Document,
  keyword: string,
  article: any,
): AdvancedSEOAnalysisResult["contentAnalysis"] {
  const title = document.querySelector("title")?.textContent || "";
  const description =
    document
      .querySelector('meta[name="description"]')
      ?.getAttribute("content") || "";
  const h1 = Array.from(document.querySelectorAll("h1")).map(
    (el) => el.textContent || "",
  );
  const h2 = Array.from(document.querySelectorAll("h2")).map(
    (el) => el.textContent || "",
  );
  const content = article?.textContent || "";
  const wordCount = content.split(/\s+/).length;
  const keywordDensity = calculateKeywordDensity(content, keyword);
  const readabilityScore = calculateReadabilityScore(content);

  // Additional content quality analysis
  const paragraphs = document.querySelectorAll("p");
  const sentences = content.match(/[^\.!\?]+[\.!\?]+/g) || [];
  const longSentences = sentences.filter(
    (s: {
      split: (arg0: RegExp) => { (): any; new (): any; length: number };
    }) => s.split(/\s+/).length > 20,
  ).length;
  const passiveVoiceCount = countPassiveVoice(content);
  const transitionWords = findTransitionWords(content);

  const words = content.toLowerCase().split(/\s+/);
  const uniqueWords = new Set(words).size;
  const lexicalDensity = (uniqueWords / words.length) * 100;

  return {
    title,
    description,
    h1,
    h2,
    wordCount,
    keywordDensity,
    readabilityScore,
    contentQuality: {
      paragraphCount: paragraphs.length,
      sentenceCount: sentences.length,
      averageSentenceLength: wordCount / sentences.length,
      longSentences,
      passiveVoiceCount,
      transitionWords,
      uniqueWords,
      lexicalDensity,
    },
    topicCoverage: analyzeTopicCoverage(content),
    contentGaps: identifyContentGaps(content, keyword),
    sentiment: analyzeSentiment(content),
    entityAnalysis: analyzeEntities(content),
  };
}

// Function to analyze technical SEO aspects
async function analyzeTechnicalSEO(
  url: string,
  document: Document,
  headers: any,
  loadTime: number,
): Promise<AdvancedSEOAnalysisResult["technicalSEO"]> {
  const parsedUrl = new URL(url);
  const mobileResponsive = checkMobileResponsiveness(document);
  const httpsEnabled = parsedUrl.protocol === "https:";
  const robotsTxt = await checkRobotsTxt(parsedUrl.origin);
  const sitemapXml = await checkSitemapXml(parsedUrl.origin);
  const canonicalTag =
    document.querySelector('link[rel="canonical"]')?.getAttribute("href") ||
    null;
  const structuredData = extractStructuredData(document);
  const hreflangTags = Array.from(
    document.querySelectorAll('link[rel="alternate"][hreflang]'),
  ).map((el) => ({
    lang: el.getAttribute("hreflang") || "",
    url: el.getAttribute("href") || "",
  }));

  return {
    loadTime,
    mobileResponsive,
    httpsEnabled,
    robotsTxt,
    sitemapXml,
    canonicalTag,
    structuredData,
    hreflangTags,
    securityHeaders: extractSecurityHeaders(headers),
    compressionEnabled:
      headers["content-encoding"] === "gzip" ||
      headers["content-encoding"] === "deflate",
    serverSignature: headers["server"] || null,
  };
}

// Function to analyze the link structure of the page
function analyzeLinkStructure(document: Document, baseUrl: string) {
  const allLinks = Array.from(document.querySelectorAll("a"));
  const internalLinks = allLinks
    .filter((a) => isInternalLink(a.href, baseUrl))
    .map((a) => a.href);
  const externalLinks = allLinks
    .filter((a) => !isInternalLink(a.href, baseUrl))
    .map((a) => a.href);
  const anchorTextDistribution: { [key: string]: number } = {};
  allLinks.forEach((a) => {
    const anchorText = a.textContent?.trim();
    if (anchorText) {
      anchorTextDistribution[anchorText] =
        (anchorTextDistribution[anchorText] || 0) + 1;
    }
  });

  return {
    internalLinks,
    externalLinks,
    brokenLinks: [], // We can't check for broken links client-side
    anchorTextDistribution,
  };
}

// Function to generate SEO suggestions based on analysis
function generateAdvancedSuggestions(
  analysisData: Partial<AdvancedSEOAnalysisResult>,
): AdvancedSEOAnalysisResult["suggestions"] {
  const suggestions: AdvancedSEOAnalysisResult["suggestions"] = [];

  if (
    analysisData.contentAnalysis?.title.length < 30 ||
    analysisData.contentAnalysis?.title.length > 60
  ) {
    suggestions.push({
      type: "warning",
      category: "Content",
      title: "Optimize Title Length",
      description: "Title should be between 30-60 characters for optimal SEO.",
    });
  }

  if (
    analysisData.contentAnalysis?.keywordDensity < 0.5 ||
    analysisData.contentAnalysis?.keywordDensity > 2.5
  ) {
    suggestions.push({
      type: "improvement",
      category: "Content",
      title: "Adjust Keyword Density",
      description:
        "Aim for a keyword density between 0.5% and 2.5% for better optimization.",
    });
  }

  if (!analysisData.technicalSEO?.httpsEnabled) {
    suggestions.push({
      type: "critical",
      category: "Technical SEO",
      title: "Enable HTTPS",
      description:
        "Secure your website by enabling HTTPS to improve trust and SEO ranking.",
    });
  }

  if (
    analysisData.technicalSEO?.loadTime &&
    analysisData.technicalSEO.loadTime > 3000
  ) {
    suggestions.push({
      type: "warning",
      category: "Performance",
      title: "Improve Page Load Time",
      description:
        "Your page load time is over 3 seconds. Optimize images and minimize JavaScript for better performance.",
    });
  }

  return suggestions;
}

// Helper functions

function calculateKeywordDensity(content: string, keyword: string): number {
  const words = content.toLowerCase().split(/\s+/);
  const keywordCount = words.filter(
    (word) => word === keyword.toLowerCase(),
  ).length;
  return (keywordCount / words.length) * 100;
}

function calculateReadabilityScore(content: string): number {
  const sentences = content.split(/[.!?]+/);
  const words = content.split(/\s+/);
  const syllables = content
    .toLowerCase()
    .split(/[^aeiouy]+/)
    .filter(Boolean).length;
  return (
    206.835 -
    1.015 * (words.length / sentences.length) -
    84.6 * (syllables / words.length)
  );
}

function countPassiveVoice(content: string): number {
  const passivePattern =
    /\b(am|is|are|was|were|be|been|being)\s+(\w+ed|[^aeiou\s]+en)\b/gi;
  return (content.match(passivePattern) || []).length;
}

function findTransitionWords(content: string): string[] {
  const transitionWords = [
    "additionally",
    "consequently",
    "furthermore",
    "moreover",
    "however",
    "nevertheless",
    "therefore",
    "thus",
    "in contrast",
    "on the other hand",
  ];
  return content
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => transitionWords.includes(word));
}

function analyzeTopicCoverage(content: string): string[] {
  const words = content.toLowerCase().split(/\s+/);
  const wordFrequency: { [key: string]: number } = {};
  words.forEach((word) => {
    if (word.length > 3) {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    }
  });
  return Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map((entry) => entry[0]);
}

function identifyContentGaps(content: string, keyword: string): string[] {
  const relatedKeywords = [
    "seo",
    "search engine optimization",
    "keywords",
    "backlinks",
    "content marketing",
    "meta tags",
  ];
  return relatedKeywords.filter(
    (related) => !content.toLowerCase().includes(related.toLowerCase()),
  );
}

function analyzeSentiment(content: string): number {
  const positiveWords = [
    "good",
    "great",
    "excellent",
    "amazing",
    "wonderful",
    "fantastic",
    "awesome",
  ];
  const negativeWords = [
    "bad",
    "poor",
    "terrible",
    "awful",
    "horrible",
    "dreadful",
    "disappointing",
  ];

  const words = content.toLowerCase().split(/\s+/);
  const positiveCount = words.filter((word) =>
    positiveWords.includes(word),
  ).length;
  const negativeCount = words.filter((word) =>
    negativeWords.includes(word),
  ).length;

  return (positiveCount - negativeCount) / words.length;
}

function analyzeEntities(content: string): { [entity: string]: number } {
  const entities: { [entity: string]: number } = {};
  const words = content.split(/\s+/);
  for (let i = 0; i < words.length; i++) {
    if (words[i].match(/^[A-Z][a-z]+$/)) {
      const entity = words[i];
      entities[entity] = (entities[entity] || 0) + 1;
    }
  }
  return entities;
}

function checkMobileResponsiveness(document: Document): boolean {
  const viewport = document
    .querySelector('meta[name="viewport"]')
    ?.getAttribute("content");
  const responsiveStyles = Array.from(
    document.querySelectorAll("link[rel='stylesheet']"),
  ).some((link) => link.getAttribute("href")?.includes("responsive"));
  return !!viewport && responsiveStyles;
}

async function checkRobotsTxt(origin: string) {
  try {
    const response = await fetchUrl(`${origin}/robots.txt`);
    return { exists: true, content: response.html };
  } catch (error) {
    return { exists: false, content: "" };
  }
}

async function checkSitemapXml(origin: string) {
  try {
    await fetchUrl(`${origin}/sitemap.xml`);
    return { exists: true, url: `${origin}/sitemap.xml` };
  } catch (error) {
    return { exists: false, url: "" };
  }
}

function extractStructuredData(document: Document): any[] {
  return Array.from(
    document.querySelectorAll('script[type="application/ld+json"]'),
  )
    .map((script) => {
      try {
        return JSON.parse(script.textContent || "");
      } catch (error) {
        console.error("Error parsing structured data:", error);
        return null;
      }
    })
    .filter((data) => data !== null);
}

function extractSecurityHeaders(headers: any): {
  [header: string]: string | undefined;
} {
  return {
    "Strict-Transport-Security": headers["strict-transport-security"],
    "X-Frame-Options": headers["x-frame-options"],
    "X-Content-Type-Options": headers["x-content-type-options"],
    "Referrer-Policy": headers["referrer-policy"],
    "Content-Security-Policy": headers["content-security-policy"],
  };
}

function isInternalLink(href: string, baseUrl: string): boolean {
  try {
    const url = new URL(href, baseUrl);
    return url.hostname === new URL(baseUrl).hostname;
  } catch (error) {
    return href.startsWith("/") || href.startsWith("#");
  }
}
