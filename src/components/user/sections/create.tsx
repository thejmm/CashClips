// src/components/user/Create.tsx

import {
  AlertCircle,
  Check,
  Loader,
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { DefaultSource, defaultSources } from "@/utils/creatomate/templates";
import React, { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { observer } from "mobx-react-lite";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { videoCreator } from "@/store/creatomate";

const stepTitles = [
  "Select a Template",
  "Choose Your Video",
  "Add Captions & Rearrange",
  "Render and Export",
];

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
}) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;

          return (
            <React.Fragment key={index}>
              <div className="relative flex flex-col items-center">
                <motion.button
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-200 ${
                    isCompleted
                      ? "border-green-500 bg-green-500 text-white"
                      : isCurrent
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-300 bg-white text-gray-500"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onStepClick(stepNumber)}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <span className="text-sm font-semibold">{stepNumber}</span>
                  )}
                </motion.button>
                <motion.div
                  className={`absolute -bottom-6 w-max text-center text-xs font-medium ${
                    isCurrent ? "text-blue-600" : "text-gray-500"
                  }`}
                  initial={false}
                  animate={{ scale: isCurrent ? 1.1 : 1 }}
                >
                  {step}
                </motion.div>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-gray-300">
                  <motion.div
                    className="h-full bg-green-500"
                    initial={{ width: "0%" }}
                    animate={{
                      width: isCompleted ? "100%" : "0%",
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

const Create: React.FC = observer(() => {
  const router = useRouter();
  const { step } = router.query;
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] =
    useState<DefaultSource | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isPreviewInitialized, setIsPreviewInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (step) {
      const stepNumber = Number(step);
      if (stepNumber >= 1 && stepNumber <= 4) {
        setCurrentStep(stepNumber);
      } else {
        setError("Invalid step number");
        setCurrentStep(1);
      }
    }
  }, [step]);

  useEffect(() => {
    router.push(`/user/create?step=${currentStep}`, undefined, {
      shallow: true,
    });
  }, [currentStep, router]);

  useEffect(() => {
    if (currentStep === 3 && previewRef.current && !videoCreator.preview) {
      videoCreator
        .initializeVideoPlayer(previewRef.current)
        .then(() => {
          setIsPreviewInitialized(true);
          console.log("Preview initialized");
        })
        .catch((err) => {
          setError("Failed to initialize preview: " + err.message);
        });
    }
  }, [currentStep]);

  const handleTemplateSelect = async (template: DefaultSource) => {
    try {
      setSelectedTemplate(template);
      await videoCreator.setSelectedSource(template);
      setCurrentStep(2);
    } catch (err) {
      setError("Failed to set template: " + (err as Error).message);
    }
  };

  const handleVideoSelect = async (videoUrl: string) => {
    try {
      setSelectedVideo(videoUrl);
      if (videoCreator.preview) {
        await videoCreator.updateVideoSource("video1", videoUrl);
      }
      setCurrentStep(3);
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
      // Handle the export result (e.g., show download link)
    } catch (err) {
      setError("Export error: " + (err as Error).message);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {defaultSources.map((template) => (
              <motion.div
                key={template.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border p-4 rounded cursor-pointer hover:border-blue-500 transition-colors duration-200"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Replace with your actual video selection UI */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border p-4 rounded cursor-pointer hover:border-blue-500 transition-colors duration-200"
                onClick={() =>
                  handleVideoSelect("https://example.com/video1.mp4")
                }
              >
                <img
                  src="/placeholder-video.jpg"
                  alt="Video 1"
                  className="w-full h-40 object-cover mb-2 rounded"
                />
                <p className="text-center font-medium">Video 1</p>
              </motion.div>
              {/* Add more video options here */}
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
            <div className="flex-grow relative">
              <div
                ref={previewRef}
                className="w-full h-full absolute inset-0"
              />
            </div>
            <div className="bg-gray-200 p-4 rounded-b-lg">
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
                  >
                    <SkipForwardIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            {currentStep === 3 && (
              <Button onClick={handleGenerateCaptions} className="mt-4">
                Generate Captions
              </Button>
            )}
            {currentStep === 4 && (
              <Button onClick={handleExport} className="mt-4">
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
        onStepClick={setCurrentStep}
      />
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="block sm:inline">{error}</span>
            </span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <Button variant="ghost" size="sm" onClick={() => setError(null)}>
                &times;
              </Button>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {!isPreviewInitialized && (currentStep === 3 || currentStep === 4) ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center justify-center h-64"
          >
            <div className="text-center">
              <Loader className="mx-auto h-12 w-12 animate-spin mb-4" />
              <p className="text-xl font-bold">Initializing editor...</p>
            </div>
          </motion.div>
        ) : (
          renderStep()
        )}
      </AnimatePresence>
    </div>
  );
});

export default Create;