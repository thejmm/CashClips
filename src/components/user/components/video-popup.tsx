import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

import { X } from "lucide-react";

interface VideoViewerProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}

const animationVariants = {
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  content: {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 },
  },
  button: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
};

const VideoViewer: React.FC<VideoViewerProps> = ({
  isOpen,
  onClose,
  videoUrl,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const handleVideoLoad = () => {
      if (videoRef.current) {
        const { videoWidth, videoHeight } = videoRef.current;
        setIsPortrait(videoHeight > videoWidth);
      }
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener("loadedmetadata", handleVideoLoad);
    }

    return () => {
      if (video) {
        video.removeEventListener("loadedmetadata", handleVideoLoad);
      }
    };
  }, [videoUrl]);

  const getPopupStyle = () => {
    const maxWidth = Math.min(window.innerWidth * 0.8, 1200);
    const maxHeight = window.innerHeight * 0.8;

    let width, height;

    if (!isPortrait) {
      // Landscape (16:9)
      const aspectRatio = 16 / 9;
      height = Math.min(maxHeight, maxWidth / aspectRatio);
      width = height * aspectRatio;
    } else {
      // Portrait (9:16)
      const aspectRatio = 9 / 16;
      width = Math.min(maxWidth, maxHeight * aspectRatio);
      height = width / aspectRatio;
    }

    return {
      width: `${width}px`,
      height: `${height}px`,
      maxWidth: `${maxWidth}px`,
      maxHeight: `${maxHeight}px`,
    };
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <motion.div
            variants={animationVariants.backdrop}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            variants={animationVariants.content}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative mx-4 md:mx-0 flex items-center justify-center"
            style={getPopupStyle()}
          >
            <motion.button
              variants={animationVariants.button}
              transition={{ duration: 0.2 }}
              className="absolute -top-12 right-0 text-white text-xl bg-neutral-900/50 ring-1 backdrop-blur-md rounded-full p-2 dark:bg-neutral-100/50 dark:text-black"
              onClick={onClose}
              aria-label="Close video"
            >
              <X className="size-5" />
            </motion.button>
            <div className="w-full h-full border-2 border-white rounded-2xl overflow-hidden isolate z-[1] relative flex items-center justify-center">
              {!videoUrl ? (
                <img
                  src="https://via.placeholder.com/1280x720"
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="max-w-full max-h-full rounded-2xl object-contain"
                  controls
                  playsInline
                  autoPlay
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoViewer;
