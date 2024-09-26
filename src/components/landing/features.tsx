// src/components/landing/features.tsx
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
    title: "Clip Library",
    description:
      "Thousands of raw clips available. WE gather the clips so YOU dont have to!",
    images: [
      {
        src: "https://via.placeholder.com/80x80.png?text=Clip+1",
        alt: "RAW CLIPS",
        className: "rounded-lg w-1/3 h-1/3 object-cover",
      },
      {
        src: "https://via.placeholder.com/100x100.png?text=Clip+2",
        alt: "STREAM CLIPS",
        className:
          "rounded-lg w-1/4 h-1/4 object-cover absolute top-1/4 right-0",
      },
      {
        src: "https://via.placeholder.com/120x60.png?text=Logo",
        alt: "SNAP CLIPS",
        className: "rounded-lg w-1/2 h-1/4 object-contain absolute bottom-0",
      },
    ],
  },
  {
    icon: Edit,
    title: "Templates",
    description:
      "Choose from various templates. WE build the templates so YOU dont have to!",
    images: [
      {
        src: "/templates/picture-in-picture.png",
        alt: "Picture-in-Picture",
        className: "rounded-lg w-1/2 h-1/4 object-contain absolute top-0",
      },
      {
        src: "/templates/split-screen-portrait.png",
        alt: "Portrait Split Screen",
        className:
          "rounded-lg w-1/2 h-3/4 object-cover absolute top-1/2 right-0",
      },
      {
        src: "/templates/blur-landscape.png",
        alt: "Landscape Blur Sides",
        className: "rounded-lg w-1/2 h-1/4 object-contain absolute bottom-0",
      },
    ],
  },
  {
    icon: Users,
    title: "Streamer Picks",
    description:
      "Select streamers and create clips. WE pick the top streamers so YOU dont have to!",
    images: [
      {
        src: "https://via.placeholder.com/500x300.png?text=xQc",
        alt: "xQc",
        className:
          "rounded-lg absolute w-[30%] h-[15%] top-[5%] left-[5%] object-cover", // Medium horizontal at top-left
      },
      {
        src: "https://via.placeholder.com/300x500.png?text=NICKMERCS",
        alt: "NICKMERCS",
        className:
          "rounded-lg absolute w-[20%] h-[35%] top-[10%] right-[10%] object-cover", // Tall vertical at top-right
      },
      {
        src: "https://via.placeholder.com/300x300.png?text=MrBeast",
        alt: "MrBeast",
        className:
          "rounded-lg absolute w-[15%] h-[15%] top-[25%] left-[35%] object-cover", // Small square at center-left
      },
      {
        src: "https://via.placeholder.com/600x200.png?text=Trainwreckstv",
        alt: "Trainwreckstv",
        className:
          "rounded-lg absolute w-[40%] h-[12%] top-[50%] left-[10%] object-cover", // Wide horizontal in the middle
      },
      {
        src: "https://via.placeholder.com/200x600.png?text=Adin+Ross",
        alt: "Adin Ross",
        className:
          "rounded-lg absolute w-[15%] h-[40%] top-[10%] left-[60%] object-cover", // Narrow tall at top-center-right
      },
      {
        src: "https://via.placeholder.com/500x500.png?text=Sneako",
        alt: "Sneako",
        className:
          "rounded-lg absolute w-[25%] h-[25%] top-[60%] left-[45%] object-cover", // Medium square towards bottom-center
      },
      {
        src: "https://via.placeholder.com/700x300.png?text=Jack+Doherty",
        alt: "Jack Doherty",
        className:
          "rounded-lg absolute w-[35%] h-[15%] top-[70%] left-[5%] object-cover", // Wide rectangular near bottom-left
      },
    ],
  },
  {
    icon: Sparkles,
    title: "AI Captions",
    description:
      "Auto-caption clips for engagement. WE create captions so YOU dont have to!",
    images: [
      {
        src: "https://via.placeholder.com/150x80.png?text=Caption+Demo",
        alt: "Caption Demo",
        className: "rounded-lg w-full h-2/3 object-cover",
      },
      {
        src: "https://via.placeholder.com/60x60.png?text=AI+Icon",
        alt: "AI Icon",
        className:
          "rounded-full w-1/6 h-1/6 object-contain absolute bottom-0 right-0",
      },
    ],
  },
  {
    icon: Zap,
    title: "Quick Clips",
    description:
      "Generate clips in seconds. YOU share the clips so WE dont have to!",
    images: [
      {
        src: "https://via.placeholder.com/80x80.png?text=Before",
        alt: "Before Clip",
        className: "rounded-lg w-1/4 h-1/4 object-cover",
      },
      {
        src: "https://via.placeholder.com/80x80.png?text=After",
        alt: "After Clip",
        className:
          "rounded-lg w-1/3 h-1/3 object-cover absolute bottom-0 right-0",
      },
      {
        src: "https://via.placeholder.com/40x40.png?text=Arrow",
        alt: "Arrow Icon",
        className:
          "w-1/6 h-1/6 object-contain absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
      },
    ],
  },
  {
    icon: Globe,
    title: "Platform Support",
    description:
      "Supports Kick, Twitch, YouTube, and more. WE support all so YOU dont have to!",
    images: [
      {
        src: "https://via.placeholder.com/200x100.png?text=Collage",
        alt: "Platform Collage",
        className: "rounded-lg w-3/4 h-3/4 object-cover",
      },
    ],
  },
];

const FEATURE_DURATION = 5000;

const FeatureIcon: React.FC<{
  icon: React.ElementType;
  isActive: boolean;
  progress: number;
}> = ({ icon: Icon, isActive, progress }) => (
  <div className="relative">
    <motion.div
      className={`flex h-12 w-12 items-center justify-center rounded-full ${
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
    <svg className="absolute left-0 top-0 h-full w-full -rotate-90">
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
  images: { src: string; alt: string; className: string }[];
  isActive: boolean;
}> = ({ title, description, images, isActive }) => (
  <AnimatePresence mode="wait">
    {isActive && (
      <motion.div
        key={title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 flex flex-col justify-between p-6 md:flex-row"
      >
        <div className="pr-4 md:w-1/2">
          <motion.h3
            className="mb-2 text-xl font-bold md:text-2xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {title}
          </motion.h3>
          <motion.p
            className="text-sm text-gray-600 md:text-base"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {description}
          </motion.p>
        </div>
        <motion.div
          className="mt-4 grid grid-cols-2 gap-4 md:mt-0 md:w-3/4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {images.map((image, index) => (
            <div key={index} className="relative h-full w-full">
              <img
                src={image.src}
                alt={image.alt}
                className={`rounded-lg ${image.className}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ))}
        </motion.div>
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
          className="mb-8 text-center text-2xl font-bold md:mb-16 md:text-4xl"
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
          className="relative flex min-h-[400px] flex-col rounded-lg md:h-[500px] md:flex-row"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.div
            className="flex w-full flex-row justify-start space-x-4 space-y-0 overflow-x-auto p-4 md:w-1/3 md:flex-col md:justify-center md:space-x-0 md:space-y-8 md:overflow-x-visible md:p-8"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex cursor-pointer flex-col items-center md:flex-row md:space-x-4"
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
                  className={`text-xs font-semibold transition-colors duration-300 md:text-sm ${
                    activeFeature === index ? "text-primary" : "text-gray-600"
                  }`}
                >
                  {feature.title}
                </span>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            className="relative min-h-96 w-full rounded-xl border p-4 md:w-2/3 md:p-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {features.map((feature, index) => (
              <FeatureContent
                key={index}
                title={feature.title}
                description={feature.description}
                images={feature.images}
                isActive={activeFeature === index}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
