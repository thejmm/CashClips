// src/components/landing/sections/bento/seo-optimization.tsx

import {
  AlertTriangle,
  Award,
  BarChart,
  Check,
  Globe,
  Search,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const SEOOptimization: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  const [content, setContent] = useState("");
  const [score, setScore] = useState(0);
  const [keywordDensity, setKeywordDensity] = useState(0);
  const [competitorScores, setCompetitorScores] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  const suggestions = [
    { text: "Use keyword in title", category: "on-page" },
    { text: "Include in meta description", category: "meta" },
    { text: "Add to first paragraph", category: "content" },
    { text: "Use in image alt tags", category: "media" },
    { text: "Include in URL structure", category: "technical" },
    { text: "Use in H1 tag", category: "on-page" },
    { text: "Include in subheadings", category: "content" },
    { text: "Use LSI keywords", category: "content" },
    { text: "Optimize loading speed", category: "technical" },
    { text: "Create quality backlinks", category: "off-page" },
  ];

  useEffect(() => {
    if (keyword && content) {
      const wordCount = content.split(/\s+/).length;
      const keywordCount = (content.match(new RegExp(keyword, "gi")) || [])
        .length;
      const density = (keywordCount / wordCount) * 100;
      setKeywordDensity(Number(density.toFixed(2)));

      const newScore = Math.min(
        100,
        keyword.length * 5 +
          (content.length > 300 ? 20 : 0) +
          (density >= 1 && density <= 3 ? 30 : 0) +
          (content.toLowerCase().includes(keyword.toLowerCase()) ? 20 : 0),
      );
      setScore(newScore);

      // Simulate competitor scores
      setCompetitorScores([
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100),
      ]);
    } else {
      setScore(0);
      setKeywordDensity(0);
      setCompetitorScores([]);
    }
  }, [keyword, content]);

  const filteredSuggestions = useMemo(() => {
    return suggestions.filter(
      (suggestion) => score <= 80 || suggestion.category === activeTab,
    );
  }, [score, activeTab]);

  const renderScoreGauge = () => (
    <div className="relative w-32 h-32">
      <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#e6e6e6"
          strokeWidth="10"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={score > 80 ? "#10B981" : score > 50 ? "#FBBF24" : "#EF4444"}
          strokeWidth="10"
          strokeDasharray={`${score * 2.83} 283`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
        {score}
      </div>
    </div>
  );

  const renderCompetitorComparison = () => (
    <div className="mt-4">
      <h5 className="font-semibold mb-2">Competitor Comparison</h5>
      <div className="space-y-2">
        {competitorScores.map((compScore, index) => (
          <div key={index} className="flex items-center">
            <span className="w-24">Competitor {index + 1}</span>
            <Progress value={compScore} className="flex-grow h-2 mx-2" />
            <span>{compScore}</span>
          </div>
        ))}
        <div className="flex items-center font-semibold">
          <span className="w-24">Your Score</span>
          <Progress value={score} className="flex-grow h-2 mx-2" />
          <span>{score}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col bg-primary rounded-lg p-4 overflow-auto">
      <div className="h-full flex items-center mb-4">
        <Search className="mr-2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Enter focus keyword..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
      <Tabs defaultValue="overview" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="flex-grow overflow-auto">
          <div className="flex justify-between items-start mb-4">
            {renderScoreGauge()}
            <div className="flex-grow ml-4">
              <h4 className="font-semibold mb-2">Quick Stats</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Keyword Density:</span>
                  <span>{keywordDensity}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Content Length:</span>
                  <span>{content.length} chars</span>
                </div>
              </div>
            </div>
          </div>
          {renderCompetitorComparison()}
        </TabsContent>
        <TabsContent value="content" className="flex-grow overflow-auto">
          <textarea
            className="w-full h-32 p-2 rounded border mb-4"
            placeholder="Enter your content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <h5 className="font-semibold mb-2">Content Analysis</h5>
          <ul className="space-y-2">
            <li className="flex items-center">
              <Check className="mr-2 text-green-500" />
              Keyword used in content
            </li>
            <li className="flex items-center">
              {keywordDensity >= 1 && keywordDensity <= 3 ? (
                <Check className="mr-2 text-green-500" />
              ) : (
                <X className="mr-2 text-red-500" />
              )}
              Optimal keyword density (1-3%)
            </li>
            <li className="flex items-center">
              {content.length > 300 ? (
                <Check className="mr-2 text-green-500" />
              ) : (
                <AlertTriangle className="mr-2 text-yellow-500" />
              )}
              Content length (aim for `&gt;`300 chars)
            </li>
          </ul>
        </TabsContent>
        <TabsContent value="technical" className="flex-grow overflow-auto">
          <h5 className="font-semibold mb-2">Technical SEO Checklist</h5>
          <ul className="space-y-2">
            <li className="flex items-center">
              <Check className="mr-2 text-green-500" />
              Mobile-friendly design
            </li>
            <li className="flex items-center">
              <Check className="mr-2 text-green-500" />
              HTTPS enabled
            </li>
            <li className="flex items-center">
              <AlertTriangle className="mr-2 text-yellow-500" />
              Improve page load speed
            </li>
            <li className="flex items-center">
              <X className="mr-2 text-red-500" />
              Fix broken links
            </li>
          </ul>
        </TabsContent>
      </Tabs>
      <div className="mt-4">
        <h4 className="font-semibold mb-2">SEO Suggestions:</h4>
        <ul className="space-y-2">
          <AnimatePresence>
            {filteredSuggestions.map((suggestion, index) => (
              <motion.li
                key={suggestion.text}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: score > index * 10 ? 1 : 0 }}
                  className="mr-2 text-green-500"
                >
                  <Check size={14} />
                </motion.div>
                {suggestion.text}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="ml-2">
                      <AlertTriangle size={14} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <p>Tip: {suggestion.text}</p>
                  </PopoverContent>
                </Popover>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
};

export default SEOOptimization;
