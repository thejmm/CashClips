import {
  AlertTriangle,
  Check,
  ChevronDown,
  Eye,
  Heading1,
  ImageIcon,
  Palette,
  RefreshCw,
  Search,
  Tag,
  Type,
  X,
} from "lucide-react";
// src\components\landing\sections\features.tsx
import { AnimatePresence, motion, useInView } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { DragHandleDots1Icon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

type FeatureId =
  | "drag-and-drop"
  | "seo-optimizer"
  | "meta-tag-generator"
  | "accessibility-checker"
  | "theme-generator";

type FeatureData = {
  id: FeatureId;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const features: FeatureData[] = [
  {
    id: "drag-and-drop",
    title: "Drag-and-Drop Builder",
    description: "Create websites with our drag-and-drop interface.",
    icon: <DragHandleDots1Icon className="w-6 h-6" />,
  },
  {
    id: "seo-optimizer",
    title: "SEO Optimizer",
    description: "Analyze and enhance your site's SEO performance.",
    icon: <Search className="w-6 h-6" />,
  },
  {
    id: "meta-tag-generator",
    title: "Meta Tag Generator",
    description: "Generate meta tags for better search engine results.",
    icon: <Tag className="w-6 h-6" />,
  },
  {
    id: "accessibility-checker",
    title: "Accessibility Checker",
    description: "Identify and fix accessibility issues on your site.",
    icon: <Eye className="w-6 h-6" />,
  },
  {
    id: "theme-generator",
    title: "Theme Generator",
    description: "Create and customize color themes for your site.",
    icon: <Palette className="w-6 h-6" />,
  },
];

interface FeatureItemProps {
  feature: FeatureData;
  isActive: boolean;
  onClick: () => void;
  progress: number;
}

const FeatureItem: React.FC<FeatureItemProps> = ({
  feature,
  isActive,
  onClick,
  progress,
}) => (
  <motion.div
    className={cn(
      "group relative overflow-hidden bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl cursor-pointer transition-all duration-300",
      isActive
        ? "ring-2 ring-primary"
        : "hover:bg-neutral-100 dark:hover:bg-neutral-700",
    )}
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-center mb-2">
      {feature.icon}
      <h3 className="font-semibold ml-2 text-primary text-sm">
        {feature.title}
      </h3>
    </div>
    <p className="text-foreground text-xs">{feature.description}</p>
    {isActive && (
      <motion.div
        className="absolute left-0 bottom-0 h-1 bg-primary"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.1, ease: "linear" }}
      />
    )}
  </motion.div>
);

type ElementType = "Header" | "Image" | "Text";

interface Element {
  id: string;
  type: ElementType;
  content: string;
  style?: React.CSSProperties;
}

const DragAndDropDemo: React.FC = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [dragging, setDragging] = useState<ElementType | null>(null);
  const [activeElement, setActiveElement] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, type: ElementType) => {
    e.dataTransfer.setData("text/plain", type);
    setDragging(type);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("text") as ElementType;
    const newElement: Element = {
      id: Date.now().toString(),
      type,
      content: getDefaultContent(type),
      style: getDefaultStyle(type),
    };
    setElements((prev) => [...prev, newElement]);
    setDragging(null);
  };

  const handleElementClick = (id: string) => {
    setActiveElement(id === activeElement ? null : id);
  };

  const updateElementContent = (id: string, content: string) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, content } : el)),
    );
  };

  const updateElementStyle = (id: string, style: React.CSSProperties) => {
    setElements((prev) =>
      prev.map((el) =>
        el.id === id ? { ...el, style: { ...el.style, ...style } } : el,
      ),
    );
  };

  const getDefaultContent = (type: ElementType): string => {
    switch (type) {
      case "Header":
        return "New Header";
      case "Image":
        return "/api/placeholder/400/300";
      case "Text":
        return "New paragraph text";
    }
  };

  const getDefaultStyle = (type: ElementType): React.CSSProperties => {
    switch (type) {
      case "Header":
        return { fontSize: "24px", fontWeight: "bold" };
      case "Image":
        return { width: "100%", height: "auto" };
      case "Text":
        return { fontSize: "16px" };
    }
  };

  const renderElement = (el: Element) => {
    switch (el.type) {
      case "Header":
        return <h2 style={el.style}>{el.content}</h2>;
      case "Image":
        return <img src={el.content} alt="Placeholder" style={el.style} />;
      case "Text":
        return <p style={el.style}>{el.content}</p>;
    }
  };

  const draggableItems: { type: ElementType; icon: React.ReactNode }[] = [
    { type: "Header", icon: <Heading1 className="w-6 h-6" /> },
    { type: "Image", icon: <ImageIcon className="w-6 h-6" /> },
    { type: "Text", icon: <Type className="w-6 h-6" /> },
  ];

  return (
    <div className="border-2 border-dashed border-gray-300 p-4 rounded-xl">
      <div className="flex justify-center space-x-4 mb-4">
        {draggableItems.map(({ type, icon }) => (
          <motion.div
            key={type}
            draggable
            onDragStart={(e) => handleDragStart(e as any, type)}
            className={cn(
              "bg-primary/10 p-3 rounded-lg cursor-move transition-all duration-300 flex items-center space-x-2",
              dragging === type ? "opacity-50" : "opacity-100",
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {icon}
            <span>{type}</span>
          </motion.div>
        ))}
      </div>
      <div
        className="bg-gray-100 dark:bg-gray-800 min-h-[250px] flex flex-col gap-2 p-4 rounded-xl"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {elements.map((el) => (
          <motion.div
            key={el.id}
            className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{el.type}</span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform cursor-pointer",
                  activeElement === el.id && "transform rotate-180",
                )}
                onClick={() => handleElementClick(el.id)}
              />
            </div>
            {renderElement(el)}
            {activeElement === el.id && (
              <div className="mt-2 space-y-2">
                <input
                  type="text"
                  value={el.content}
                  onChange={(e) => updateElementContent(el.id, e.target.value)}
                  className="w-full p-1 border rounded"
                />
                {el.type === "Header" && (
                  <input
                    type="number"
                    value={parseInt(el.style?.fontSize as string) || 24}
                    onChange={(e) =>
                      updateElementStyle(el.id, {
                        fontSize: `${e.target.value}px`,
                      })
                    }
                    className="w-full p-1 border rounded"
                    placeholder="Font size (px)"
                  />
                )}
                {el.type === "Text" && (
                  <input
                    type="color"
                    value={el.style?.color || "#000000"}
                    onChange={(e) =>
                      updateElementStyle(el.id, { color: e.target.value })
                    }
                    className="w-full p-1 border rounded"
                  />
                )}
              </div>
            )}
          </motion.div>
        ))}
        {elements.length === 0 && (
          <div className="text-gray-400 w-full h-full flex items-center justify-center">
            Drop elements here
          </div>
        )}
      </div>
    </div>
  );
};

const SEOOptimizerDemo: React.FC = () => {
  const [url, setUrl] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const analyzeURL = () => {
    setLoading(true);
    setTimeout(() => {
      const newScore = Math.floor(Math.random() * 41) + 60;
      setScore(newScore);
      setSuggestions([
        "Optimize meta description",
        "Improve page load speed",
        "Add more relevant keywords",
        "Increase content length",
      ]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          className="flex-grow p-2 border rounded dark:bg-gray-800"
        />
        <Button onClick={analyzeURL} disabled={loading}>
          {loading ? <RefreshCw className="animate-spin mr-2" /> : null}
          {loading ? "Analyzing..." : "Analyze"}
        </Button>
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
        <p className="text-lg font-semibold">SEO Score: {score}</p>
        <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2.5 mt-2">
          <div
            className="bg-primary h-2.5 rounded-full"
            style={{ width: `${score}%` }}
          ></div>
        </div>
        <h3 className="mt-4 font-semibold">Suggestions:</h3>
        <ul className="list-disc pl-5 mt-2">
          {suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const MetaTagGeneratorDemo: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");

  const generateMetaTags = () => {
    return `
<head>
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta property="og:title" content="${ogTitle || title}">
  <meta property="og:description" content="${ogDescription || description}">
</head>
    `.trim();
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Page Title"
        className="w-full p-2 border rounded dark:bg-gray-800"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Page Description"
        className="w-full p-2 border rounded dark:bg-gray-800 h-20"
      />
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
        <h3 className="font-semibold mb-2">Generated Meta Tags:</h3>
        <pre className="text-sm overflow-x-auto">{generateMetaTags()}</pre>
      </div>
    </div>
  );
};

const AccessibilityCheckerDemo: React.FC = () => {
  const [issues, setIssues] = useState([
    { id: 1, text: "Image missing alt text", fixed: false, severity: "high" },
    { id: 2, text: "Low color contrast", fixed: false, severity: "medium" },
    { id: 3, text: "Missing form labels", fixed: false, severity: "high" },
    {
      id: 4,
      text: "Incorrect heading hierarchy",
      fixed: false,
      severity: "medium",
    },
    { id: 5, text: "Non-descriptive link text", fixed: false, severity: "low" },
    {
      id: 6,
      text: "Missing required form fields",
      fixed: false,
      severity: "high",
    },
  ]);

  const [filter, setFilter] = useState("all");

  const toggleFix = (id: number) => {
    setIssues(
      issues.map((issue) =>
        issue.id === id ? { ...issue, fixed: !issue.fixed } : issue,
      ),
    );
  };

  const filteredIssues = issues.filter(
    (issue) =>
      filter === "all" ||
      (filter === "fixed" && issue.fixed) ||
      (filter === "unfixed" && !issue.fixed),
  );

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="text-red-500" />;
      case "medium":
        return <AlertTriangle className="text-yellow-500" />;
      case "low":
        return <AlertTriangle className="text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Accessibility Issues</h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-1 border rounded"
        >
          <option value="all">All</option>
          <option value="fixed">Fixed</option>
          <option value="unfixed">Unfixed</option>
        </select>
      </div>
      <div className="space-y-2">
        {filteredIssues.map((issue) => (
          <div
            key={issue.id}
            className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded"
          >
            <div className="flex items-center space-x-2">
              {getSeverityIcon(issue.severity)}
              <span className={issue.fixed ? "line-through text-gray-500" : ""}>
                {issue.text}
              </span>
            </div>
            <button
              onClick={() => toggleFix(issue.id)}
              className={cn(
                "px-2 py-1 rounded text-white",
                issue.fixed ? "bg-green-500" : "bg-yellow-500",
              )}
            >
              {issue.fixed ? <Check size={16} /> : <X size={16} />}
            </button>
          </div>
        ))}
      </div>
      <div className="text-sm text-gray-600">
        Total: {issues.length} | Fixed: {issues.filter((i) => i.fixed).length} |
        Unfixed: {issues.filter((i) => !i.fixed).length}
      </div>
    </div>
  );
};

const ThemeGeneratorDemo: React.FC = () => {
  const [primary, setPrimary] = useState("#3B82F6");
  const [secondary, setSecondary] = useState("#10B981");
  const [background, setBackground] = useState("#FFFFFF");
  const [text, setText] = useState("#1F2937");

  const generateCSS = () => {
    return `
@layer base {
  :root {
  --color-primary: ${primary};
  --color-secondary: ${secondary};
  --color-background: ${background};
  --color-text: ${text};
 }

  .dark {
  --color-primary: ${primary};
  --color-secondary: ${secondary};
  --color-background: ${background};
  --color-text: ${text};
    }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
    `.trim();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Primary Color
          </label>
          <input
            type="color"
            value={primary}
            onChange={(e) => setPrimary(e.target.value)}
            className="mt-1 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Secondary Color
          </label>
          <input
            type="color"
            value={secondary}
            onChange={(e) => setSecondary(e.target.value)}
            className="mt-1 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Background Color
          </label>
          <input
            type="color"
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            className="mt-1 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Text Color
          </label>
          <input
            type="color"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mt-1 w-full"
          />
        </div>
      </div>
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Generated CSS:</h3>
        <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto">
          {generateCSS()}
        </pre>
      </div>
    </div>
  );
};

interface FeatureDemoProps {
  feature: FeatureData;
}

const FeatureDemo: React.FC<FeatureDemoProps> = ({ feature }) => {
  const components: Record<FeatureId, React.FC> = {
    "drag-and-drop": DragAndDropDemo,
    "seo-optimizer": SEOOptimizerDemo,
    "meta-tag-generator": MetaTagGeneratorDemo,
    "accessibility-checker": AccessibilityCheckerDemo,
    "theme-generator": ThemeGeneratorDemo,
  };

  const DemoComponent = components[feature.id];

  return (
    <motion.div
      key={feature.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-lg h-[465px] flex flex-col" // Set a fixed height and use flex
    >
      <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
      <div className="flex-grow overflow-auto">
        <DemoComponent />
      </div>
    </motion.div>
  );
};

interface FeaturesProps {
  collapseDelay?: number;
}

export const Features: React.FC<FeaturesProps> = ({ collapseDelay = 8000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const timerRef = useRef<number | null>(null);

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setProgress(0);
    const startTime = Date.now();

    timerRef.current = window.setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = (elapsedTime / collapseDelay) * 100;

      if (newProgress >= 100) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % features.length);
        startTimer();
      } else {
        setProgress(newProgress);
      }
    }, 16);
  };

  useEffect(() => {
    if (isInView) {
      startTimer();
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isInView, collapseDelay]);

  const handleItemClick = (index: number) => {
    setCurrentIndex(index);
    startTimer();
  };

  return (
    <section ref={containerRef} className="py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          className="text-4xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          Build Your Dream Website
        </motion.h2>
        <motion.p
          className="text-xl text-center text-gray-600 dark:text-gray-300 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Create professional websites with ease using our powerful website
          builder and advanced tools.
        </motion.p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            {features.map((feature, index) => (
              <FeatureItem
                key={feature.id}
                feature={feature}
                isActive={currentIndex === index}
                onClick={() => handleItemClick(index)}
                progress={currentIndex === index ? progress : 0}
              />
            ))}
          </div>
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <FeatureDemo feature={features[currentIndex]} />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

// Mobile-specific adjustments
const MobileFeatures: React.FC<FeaturesProps> = ({ collapseDelay = 12000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isInView) {
      startTimer();
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isInView, collapseDelay]);

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setProgress(0);
    const startTime = Date.now();

    timerRef.current = window.setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = (elapsedTime / collapseDelay) * 100;

      if (newProgress >= 100) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % features.length);
        startTimer();
      } else {
        setProgress(newProgress);
      }
    }, 16);
  };

  const handleSwipe = (direction: number) => {
    const newIndex =
      (currentIndex + direction + features.length) % features.length;
    setCurrentIndex(newIndex);
    startTimer();
  };

  return (
    <section ref={containerRef} className="py-8 overflow-hidden">
      <div className="max-w-sm mx-auto px-4">
        <motion.h2
          className="text-3xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          Build Your Dream Website
        </motion.h2>
        <motion.p
          className="text-lg text-center text-gray-600 dark:text-gray-300 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Create professional websites with ease using our powerful tools.
        </motion.p>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <FeatureItem
              feature={features[currentIndex]}
              isActive={true}
              onClick={() => {}}
              progress={progress}
            />
            <FeatureDemo feature={features[currentIndex]} />
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-center mt-6 space-x-2">
          {features.map((_, index) => (
            <motion.div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full",
                currentIndex === index ? "bg-primary" : "bg-gray-300",
              )}
              animate={{
                scale: currentIndex === index ? 1.2 : 1,
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
        <div className="mt-6 flex justify-between">
          <Button variant="ringHoverOutline" onClick={() => handleSwipe(-1)}>
            Previous
          </Button>
          <Button variant="ringHoverOutline" onClick={() => handleSwipe(1)}>
            Next
          </Button>
        </div>
      </div>
    </section>
  );
};

const ResponsiveFeatures: React.FC<FeaturesProps> = (props) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile ? <MobileFeatures {...props} /> : <Features {...props} />;
};

export default ResponsiveFeatures;
