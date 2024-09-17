import {
  AnimatePresence,
  motion,
  useAnimation,
  useInView,
} from "framer-motion";
import { Edit, Globe, Sparkles, Users, Video, Zap } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const features = [
  {
    icon: Video,
    title: "Raw Clip Library",
    description: "Access thousands of raw clips from various platforms.",
  },
  {
    icon: Edit,
    title: "Custom Templates",
    description: "Choose from a variety of templates to suit your style.",
  },
  {
    icon: Users,
    title: "Streamer Selection",
    description: "Pick your favorite streamer and create clips instantly.",
  },
  {
    icon: Sparkles,
    title: "Auto-Captioning",
    description:
      "Our AI automatically captions your clips for better engagement.",
  },
  {
    icon: Zap,
    title: "Instant Generation",
    description: "Generate polished clips with just a few clicks.",
  },
  {
    icon: Globe,
    title: "Multi-Platform Support",
    description: "We support clips from Twitch, YouTube, and more!",
  },
];

const FEATURE_DURATION = 5000; // 5 seconds

const FeatureIcon: React.FC<{
  icon: React.ElementType;
  isActive: boolean;
  progress: number;
}> = ({ icon: Icon, isActive, progress }) => (
  <div className="relative">
    <motion.div
      className={`w-12 h-12 rounded-full flex items-center justify-center ${
        isActive ? "text-primary" : "text-gray-600"
      }`}
      animate={{ scale: isActive ? 1.2 : 1, rotate: isActive ? 360 : 0 }}
      transition={{
        duration: 0.5,
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      <Icon size={24} />
    </motion.div>
    <svg className="absolute top-0 left-0 w-full h-full -rotate-90">
      <circle
        cx="24"
        cy="24"
        r="20"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
        className="text-gray-200"
      />
      <motion.circle
        cx="24"
        cy="24"
        r="20"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
        className="text-primary"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: progress }}
        transition={{ duration: 0.5, ease: "linear" }}
        strokeDasharray="126"
        strokeDashoffset="0"
      />
    </svg>
  </div>
);

const FeatureContent: React.FC<{
  title: string;
  description: string;
  isActive: boolean;
}> = ({ title, description, isActive }) => (
  <AnimatePresence mode="wait">
    {isActive && (
      <motion.div
        key={title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 flex flex-col justify-center p-6"
      >
        <motion.h3
          className="text-xl md:text-2xl font-bold mb-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {title}
        </motion.h3>
        <motion.p
          className="text-sm md:text-base text-gray-600"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {description}
        </motion.p>
      </motion.div>
    )}
  </AnimatePresence>
);

export const FeaturesSection: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
      setProgress(0);
    }, FEATURE_DURATION);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 0.01, 1));
    }, FEATURE_DURATION / 100);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <section id="features" ref={containerRef} className="py-10 md:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto space-y-4 py-6 text-center">
            <h2 className="text-[14px] font-medium tracking-tight text-primary">
              FEATURES
            </h2>
            <h4 className="mx-auto mb-2 max-w-3xl text-balance text-[42px] font-medium tracking-tighter">
              What makes CashClips special
            </h4>
          </div>
        </motion.div>
        <motion.div
          className="relative min-h-[400px] md:h-[500px] rounded-lg flex flex-col md:flex-row"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.div
            className="w-full md:w-1/3 flex flex-row md:flex-col justify-start md:justify-center space-x-4 md:space-x-0 space-y-0 md:space-y-8 p-4 md:p-8 overflow-x-auto md:overflow-x-visible"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex flex-col md:flex-row items-center md:space-x-4 cursor-pointer"
                onClick={() => setActiveFeature(index)}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FeatureIcon
                  icon={feature.icon}
                  isActive={activeFeature === index}
                  progress={activeFeature === index ? progress : 0}
                />
                <span
                  className={`text-xs md:text-sm font-semibold transition-colors duration-300 ${
                    activeFeature === index ? "text-primary" : "text-gray-600"
                  }`}
                >
                  {feature.title}
                </span>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            className="w-full min-h-96 md:w-2/3 p-4 md:p-12 relative border rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {features.map((feature, index) => (
              <FeatureContent
                key={index}
                title={feature.title}
                description={feature.description}
                isActive={activeFeature === index}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
