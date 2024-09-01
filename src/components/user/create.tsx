// src/components/user/create.tsx

"use client";

import {
  AlertCircle,
  Check,
  Download,
  Loader,
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
  XIcon,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { AnimatePresence, motion } from "framer-motion";
import {
  DefaultSource,
  defaultSources,
  videoUrls,
} from "@/utils/creatomate/templates";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import Stepper from "./components/stepper";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/component";
import { observer } from "mobx-react-lite";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { videoCreator } from "@/store/creatomate";

const stepTitles = [
  "Select a Template",
  "Choose Your Video",
  "Render & Download",
];

interface CreateProps {
  user: User;
}

const Create: React.FC<CreateProps> = observer(({ user }) => {
  const router = useRouter();
  const { step } = router.query;

  // State variables
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] =
    useState<DefaultSource | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isPreviewInitialized, setIsPreviewInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [renderResult, setRenderResult] = useState<any>(null);
  const [showRenderDialog, setShowRenderDialog] = useState(false);
  const [isCaptionsGenerated, setIsCaptionsGenerated] = useState(false);
  const [isGeneratingCaptions, setIsGeneratingCaptions] = useState(false);

  const [videoSources, setVideoSources] = useState<{ [key: string]: string }>(
    Object.fromEntries(
      videoUrls.map((url) => [url, url.replace(".mp4", ".mp4-thumbnail")]),
    ),
  );

  const updateUrlStep = useCallback(
    (stepNumber: number) => {
      router.push(`/user/create?step=${stepNumber}`, undefined, {
        shallow: true,
      });
    },
    [router],
  );

  const formatTime = useCallback((time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }, []);

  const handleMouseEnter = useCallback((videoUrl: string) => {
    setVideoSources((prev) => ({ ...prev, [videoUrl]: videoUrl }));
  }, []);

  const handleMouseLeave = useCallback((videoUrl: string) => {
    setVideoSources((prev) => ({
      ...prev,
      [videoUrl]: videoUrl.replace(".mp4", ".mp4-thumbnail"),
    }));
  }, []);

  useEffect(() => {
    const supabase = createClient();

    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
      } else if (user) {
        setCurrentUser(user);
        videoCreator.setUserId(user.id);
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    const stepNumber = step ? Number(step) : 1;

    if (stepNumber === 1) {
      setCurrentStep(1);
    } else if (stepNumber === 2 && selectedTemplate) {
      setCurrentStep(2);
    } else if (
      stepNumber === 3 &&
      selectedTemplate &&
      selectedVideo &&
      isPreviewInitialized
    ) {
      setCurrentStep(3);
    } else {
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

        setDuration(videoCreator.duration);

        return () => {
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

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber === 1) {
      setCurrentStep(1);
      updateUrlStep(1);
    } else if (stepNumber === 2 && selectedTemplate) {
      setCurrentStep(2);
      updateUrlStep(2);
    } else if (
      stepNumber === 3 &&
      selectedTemplate &&
      selectedVideo &&
      isPreviewInitialized &&
      isCaptionsGenerated
    ) {
      setCurrentStep(3);
      updateUrlStep(3);
    } else {
      setError("Please complete the previous steps before proceeding.");
    }
  };

  const handleTemplateSelect = async (template: DefaultSource) => {
    try {
      setSelectedTemplate(template);
      console.log("Selected template:", template.name);
      if (videoCreator.preview) {
        console.log("Setting selected source immediately");
        await videoCreator.setSelectedSource(template);
      } else {
        console.log(
          "Preview not ready, template will be set after initialization",
        );
      }
      console.log("Template set successfully:", template.name);
      setCurrentStep(2);
      updateUrlStep(2);
    } catch (err) {
      console.error("Failed to set template:", err);
      setError("Failed to set template: " + (err as Error).message);
    }
  };

  const handleVideoSelect = async (videoUrl: string) => {
    try {
      setSelectedVideo(videoUrl);
      console.log("Selected video URL:", videoUrl);

      if (videoCreator.preview) {
        console.log("Preview is ready, updating video source immediately");
        await videoCreator.updateVideoSource("video1", videoUrl);
      } else {
        console.log("Preview not ready, queueing video update");
        videoCreator.queueVideoUpdate("video1", videoUrl);
      }

      // Trigger caption generation
      setIsGeneratingCaptions(true);
      try {
        await videoCreator.fetchCaptions(videoUrl, "video1");
        setIsCaptionsGenerated(true);
        toast.success("Captions generated successfully");
        setCurrentStep(3);
        updateUrlStep(3);
      } catch (err) {
        console.error("Error generating captions:", err);
        toast.error("Failed to generate captions");
      } finally {
        setIsGeneratingCaptions(false);
      }
    } catch (err) {
      console.error("Failed to select video:", err);
      setError("Failed to select video: " + (err as Error).message);
    }
  };

  const handleExport = async () => {
    try {
      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      setIsRendering(true);
      setShowRenderDialog(true);
      console.log("Starting video export for user:", currentUser.id);

      const jobId = await videoCreator.finishVideo();
      console.log("Render job started with ID:", jobId);

      try {
        const renderResult = await videoCreator.checkRenderStatus(jobId);
        setIsRendering(false);
        setRenderResult(renderResult);
        toast.success("Video exported successfully");
        console.log("Export result:", renderResult);
      } catch (renderError) {
        setIsRendering(false);
        console.error("Render failed:", renderError);
        setError("Render failed: " + (renderError as Error).message);
      }
    } catch (err) {
      console.error("Export error:", err);
      setError("Export error: " + (err as Error).message);
      setIsRendering(false);
      setShowRenderDialog(false);
    }
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
              {videoUrls.map((videoUrl, index) => (
                <motion.div
                  key={videoUrl}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`border p-4 rounded cursor-pointer transition-colors duration-200 ${
                    selectedVideo === videoUrl
                      ? "border-blue-500 border-2"
                      : "hover:border-blue-500"
                  }`}
                  onClick={() => handleVideoSelect(videoUrl)}
                  onMouseEnter={() => handleMouseEnter(videoUrl)}
                  onMouseLeave={() => handleMouseLeave(videoUrl)}
                >
                  <div className="relative w-full h-40 mb-2">
                    {videoSources[videoUrl].endsWith("-thumbnail") ? (
                      <img
                        src={videoSources[videoUrl]}
                        alt={`Video ${index + 1} preview`}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <video
                        key={videoSources[videoUrl]}
                        src={videoSources[videoUrl]}
                        className="w-full h-full object-cover rounded"
                        loop
                        muted
                        playsInline
                        autoPlay
                      />
                    )}
                  </div>
                  <p className="text-center font-medium">Video {index + 1}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col h-full"
          >
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
                  console.log("Ref callback called, element:", element);
                  console.log(
                    "Current videoCreator.preview?.element:",
                    videoCreator.preview?.element,
                  );
                  if (element && element !== videoCreator.preview?.element) {
                    console.log("Initializing video player");
                    videoCreator
                      .initializeVideoPlayer(element)
                      .then(() => {
                        console.log("Video player initialized");
                        setIsPreviewInitialized(true);
                        if (selectedTemplate) {
                          console.log(
                            "Setting selected source after initialization",
                          );
                          videoCreator.setSelectedSource(selectedTemplate);
                        }
                      })
                      .catch((error) => {
                        console.error(
                          "Failed to initialize video player:",
                          error,
                        );
                        setError(
                          "Failed to initialize video player: " + error.message,
                        );
                      });
                  }
                }}
                className="relative w-full h-full border rounded-t-xl"
                style={{ height: "28rem" }}
              />
            </div>
            <div className="bg-card p-4 rounded-b-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {formatTime(currentTime)} / {formatTime(duration)}
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
            <Button
              onClick={handleExport}
              className="mt-4"
              disabled={
                !isPreviewInitialized || isRendering || !isCaptionsGenerated
              }
            >
              {isRendering ? "Rendering..." : "Export Video"}
            </Button>
          </motion.div>
        );
      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <div className="w-full max-w-[23rem] sm:max-w-5xl md:max-w-7xl mx-auto space-y-8 p-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-lg md:text-3xl font-bold mb-4"
      >
        {stepTitles[currentStep - 1]}
      </motion.h1>
      <Stepper
        steps={stepTitles}
        currentStep={currentStep}
        onStepClick={handleStepClick}
        isLoading={isGeneratingCaptions || isRendering}
        loadingStep={isGeneratingCaptions ? 2 : isRendering ? 3 : 0}
        loadingMessage={
          isGeneratingCaptions
            ? "Generating captions..."
            : isRendering
              ? "Rendering video..."
              : ""
        }
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

      <AlertDialog open={showRenderDialog} onOpenChange={setShowRenderDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isRendering ? "Rendering Video" : "Render Complete"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isRendering ? (
                <div className="flex items-center">
                  <Loader className="animate-spin mr-2" />
                  Your video is being rendered. This may take a few minutes...
                </div>
              ) : (
                <div>
                  Your video has been rendered successfully! You can now
                  download it.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {!isRendering && renderResult && (
              <>
                <AlertDialogCancel>Close</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    onClick={() => window.open(renderResult.url, "_blank")}
                    className="flex items-center"
                  >
                    <Download className="mr-2 h-4 w-4" /> Download Video
                  </Button>
                </AlertDialogAction>
              </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
});

export default Create;
