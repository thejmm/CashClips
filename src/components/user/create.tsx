// src/components/user/create.tsx
"use client";

import {
  AlertCircle,
  Check,
  Loader,
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
  XIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { DefaultSource, defaultSources } from "@/utils/creatomate/templates";
import React, { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import Stepper from "./components/stepper";
import { observer } from "mobx-react-lite";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { videoCreator } from "@/store/creatomate";

const stepTitles = [
  "Select a Template",
  "Choose Your Video",
  "Add Captions & Rearrange",
  "Render & Download",
];

const Create: React.FC = observer(() => {
  const router = useRouter();
  const { step } = router.query;
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] =
    useState<DefaultSource | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isPreviewInitialized, setIsPreviewInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Function to update the URL without causing an error
  const updateUrlStep = (stepNumber: number) => {
    router.push(`/user/create?step=${stepNumber}`, undefined, {
      shallow: true,
    });
  };

  // Auto-navigation based on URL parameter
  useEffect(() => {
    const stepNumber = step ? Number(step) : 1;

    if (stepNumber === 1) {
      setCurrentStep(1);
    } else if (stepNumber === 2 && selectedTemplate) {
      setCurrentStep(2);
    } else if (stepNumber === 3 && selectedTemplate && selectedVideo) {
      setCurrentStep(3);
    } else if (
      stepNumber === 4 &&
      selectedTemplate &&
      selectedVideo &&
      isPreviewInitialized
    ) {
      setCurrentStep(4);
    } else {
      // Invalid step or missing previous steps; default to step 1 without error
      setCurrentStep(1);
      updateUrlStep(1);
    }
  }, [step, selectedTemplate, selectedVideo, isPreviewInitialized]);

  useEffect(() => {
    const updatePreviewHandlers = () => {
      if (videoCreator.preview) {
        const originalOnTimeChange = videoCreator.preview.onTimeChange;
        const originalOnStateChange = videoCreator.preview.onStateChange;

        videoCreator.preview.onTimeChange = (time: number) => {
          setCurrentTime(time);
          if (originalOnTimeChange) {
            originalOnTimeChange(time);
          }
        };

        videoCreator.preview.onStateChange = (state) => {
          setDuration(state.duration);
          if (originalOnStateChange) {
            originalOnStateChange(state);
          }
        };

        // Set initial duration
        setDuration(videoCreator.duration);

        return () => {
          // Cleanup: restore original handlers
          if (videoCreator.preview) {
            videoCreator.preview.onTimeChange = originalOnTimeChange;
            videoCreator.preview.onStateChange = originalOnStateChange;
          }
        };
      }
    };

    const cleanup = updatePreviewHandlers();

    return () => {
      if (cleanup) cleanup();
    };
  }, [videoCreator.preview]);

  // User-triggered step navigation with validation
  const handleStepClick = (stepNumber: number) => {
    if (stepNumber === 1) {
      setCurrentStep(1);
      updateUrlStep(1);
    } else if (stepNumber === 2 && selectedTemplate) {
      setCurrentStep(2);
      updateUrlStep(2);
    } else if (stepNumber === 3 && selectedTemplate && selectedVideo) {
      setCurrentStep(3);
      updateUrlStep(3);
    } else if (
      stepNumber === 4 &&
      selectedTemplate &&
      selectedVideo &&
      isPreviewInitialized
    ) {
      setCurrentStep(4);
      updateUrlStep(4);
    } else {
      setError("Please complete the previous steps before proceeding.");
    }
  };

  const handleTemplateSelect = async (template: DefaultSource) => {
    try {
      setSelectedTemplate(template);
      await videoCreator.setSelectedSource(template);
      setCurrentStep(2);
      updateUrlStep(2);
    } catch (err) {
      setError("Failed to set template: " + (err as Error).message);
    }
  };

  const handleVideoSelect = async (videoUrl: string) => {
    try {
      setSelectedVideo(videoUrl);
      if (videoCreator.preview) {
        const source = videoCreator.getActiveCompositionSource();
        const updatedElements = source.elements.map((element: any) => {
          if (element.type === "video") {
            return { ...element, source: videoUrl };
          }
          return element;
        });
        await videoCreator.setActiveCompositionSource({
          ...source,
          elements: updatedElements,
        });
      }
      setCurrentStep(3);
      updateUrlStep(3);
    } catch (err) {
      setError("Failed to select video: " + (err as Error).message);
    }
  };

  const handleGenerateCaptions = async () => {
    if (selectedVideo) {
      try {
        await videoCreator.fetchCaptions(selectedVideo, "video1");
        toast.success("Captions generated successfully");
        setCurrentStep(4);
        updateUrlStep(4);
      } catch (err) {
        setError("Error generating captions: " + (err as Error).message);
      }
    } else {
      setError("No video selected for caption generation");
    }
  };

  const handleExport = async () => {
    try {
      const result = await videoCreator.finishVideo();
      toast.success("Video exported successfully");
      console.log("Export result:", result);
    } catch (err) {
      setError("Export error: " + (err as Error).message);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {defaultSources.map((template) => (
              <motion.div
                key={template.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`border p-4 rounded cursor-pointer transition-colors duration-200 ${
                  selectedTemplate?.name === template.name
                    ? "border-blue-500 border-2"
                    : "hover:border-blue-500"
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <img
                  src={template.coverImage}
                  alt={template.name}
                  className="w-full h-48 object-cover mb-2 rounded"
                />
                <p className="text-center font-medium">{template.name}</p>
              </motion.div>
            ))}
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`border p-4 rounded cursor-pointer transition-colors duration-200 ${
                  selectedVideo ===
                  "https://cdn-crayo.com//crayo-admin/test-video/af27162a-a2db-4423-8c39-70589526f8ed-gta-7.mp4"
                    ? "border-blue-500 border-2"
                    : "hover:border-blue-500"
                }`}
                onClick={() =>
                  handleVideoSelect(
                    "https://cdn-crayo.com//crayo-admin/test-video/af27162a-a2db-4423-8c39-70589526f8ed-gta-7.mp4",
                  )
                }
              >
                <video
                  src="https://cdn-crayo.com//crayo-admin/test-video/af27162a-a2db-4423-8c39-70589526f8ed-gta-7.mp4"
                  className="w-full h-40 object-cover mb-2 rounded"
                  loop
                  muted
                  autoPlay
                  playsInline
                />
                <p className="text-center font-medium">Video 1</p>
              </motion.div>
            </div>
          </motion.div>
        );
      case 3:
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col h-[calc(100vh-200px)]"
          >
            {/* Preview Area */}
            <div className="flex-grow relative border rounded-t-xl">
              {!isPreviewInitialized && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/20 rounded-t-xl">
                  <Loader className="h-12 w-12 animate-spin" />
                  <p className="text-xl font-bold ml-4">
                    Initializing editor...
                  </p>
                </div>
              )}
              <div
                ref={(element) => {
                  if (element && element !== videoCreator.preview?.element) {
                    videoCreator.initializeVideoPlayer(element);
                  }
                }}
                className="relative w-full h-full"
                style={{ height: "25rem" }}
              />
            </div>
            {/* Controls Section */}
            <div className="bg-card p-4 rounded-b-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {formatTime(videoCreator.currentPlaybackTime)} /{" "}
                  {formatTime(videoCreator.duration)}
                </span>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => videoCreator.skipBackward()}
                    disabled={!isPreviewInitialized}
                  >
                    <SkipBackIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      videoCreator.isPlaying
                        ? videoCreator.preview?.pause()
                        : videoCreator.preview?.play()
                    }
                    disabled={!isPreviewInitialized}
                  >
                    {videoCreator.isPlaying ? (
                      <PauseIcon className="w-4 h-4" />
                    ) : (
                      <PlayIcon className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => videoCreator.skipForward()}
                    disabled={!isPreviewInitialized}
                  >
                    <SkipForwardIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            {currentStep === 3 && (
              <Button
                onClick={handleGenerateCaptions}
                className="mt-4"
                disabled={!isPreviewInitialized}
              >
                Generate Captions
              </Button>
            )}
            {currentStep === 4 && (
              <Button
                onClick={handleExport}
                className="mt-4"
                disabled={!isPreviewInitialized}
              >
                Export Video
              </Button>
            )}
          </motion.div>
        );
      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-4"
      >
        {stepTitles[currentStep - 1]}
      </motion.h1>
      <Stepper
        steps={stepTitles}
        currentStep={currentStep}
        onStepClick={handleStepClick}
      />
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-row justify-between bg-red-100 border border-red-400 text-red-700 px-4 py-3 items-center rounded relative mb-4"
            role="alert"
          >
            <span className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="block sm:inline">{error}</span>
            </span>
            <span>
              <Button
                variant="ghost"
                className="hover:border hover:bg-transparent hover:text-red-500"
                size="icon"
                onClick={() => setError(null)}
              >
                <XIcon className="w-4 h-4" />
              </Button>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      {renderStep()}
    </div>
  );
});

export default Create;
