"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useRef } from "react";

import { X } from "lucide-react";

interface VideoViewerProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}

const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const contentVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.8, y: 50 },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

const VideoViewer: React.FC<VideoViewerProps> = ({
  isOpen,
  onClose,
  videoUrl,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Animated Backdrop */}
          <motion.div
            key="backdrop"
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-10 bg-black/70 transition-opacity duration-300"
            onClick={onClose}
          />

          {/* Animated Dialog Content */}
          <motion.div
            key="content"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[999] flex items-center justify-center"
          >
            <div className="bg-card relative max-w-sm md:max-w-xl w-full rounded-lg py-10 px-6 flex items-center justify-center overflow-hidden shadow-lg">
              {/* Close Button */}
              <motion.button
                key="close-button"
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="absolute top-4 right-4 p-2 rounded-full bg-neutral-800/70 text-white hover:bg-neutral-800/90 dark:bg-neutral-100/70 dark:text-black dark:hover:bg-neutral-100/90"
                onClick={onClose}
                aria-label="Close video"
              >
                <X size={20} />
              </motion.button>

              {/* Video Element */}
              <video
                ref={videoRef}
                className="h-full w-auto object-cover max-h-[75vh]"
                src={videoUrl}
                controls
                playsInline
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default VideoViewer;
