import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

interface FinishProps {
  renderResult: any;
  handleCreateAnother: () => void;
  isVideoViewerOpen: boolean;
  setIsVideoViewerOpen: (open: boolean) => void;
}

const Finish: React.FC<FinishProps> = ({
  renderResult,
  handleCreateAnother,
  isVideoViewerOpen,
  setIsVideoViewerOpen,
}) => {
  useEffect(() => {
    if (renderResult) {
      triggerFireworks();
      triggerSideCannons();
    }
  }, [renderResult]);

  const triggerFireworks = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  const triggerSideCannons = () => {
    const end = Date.now() + 3 * 1000;
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  const handleDownload = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center space-y-6"
    >
      <h2 className="text-3xl font-bold mb-4 text-center">
        Video Creation Complete
      </h2>

      <div className="p-6 rounded-lg mb-6 w-full max-w-3xl bg-card shadow-md">
        <h3 className="text-xl font-semibold mb-3 text-center">
          Render Summary
        </h3>
        {renderResult ? (
          <>
            <p className="mb-4 text-center">
              Your video has been rendered successfully!
            </p>

            {/* Video Preview */}
            <div className="w-full flex justify-center mb-6">
              <video
                className="w-full max-w-lg h-auto rounded-lg shadow-md"
                controls
                src={renderResult.url}
              />
            </div>
          </>
        ) : (
          <p className="text-center">No render information available.</p>
        )}
      </div>

      <div className="flex flex-col items-center">
        <p className="mb-4 text-center">
          Would you like to create another video?
        </p>
        <div className="flex space-x-4">
          <Button onClick={handleCreateAnother} variant="outlineRingHover">
            Create Another Video
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Finish;
