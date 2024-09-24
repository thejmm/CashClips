// src/components/user/create/render.tsx
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DownloadIcon,
  FileTextIcon,
  Loader,
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { CloudinaryVideo } from "@/types/cloudinary"; // Updated import
import { DefaultSource } from "@/utils/creatomate/template-types";
import { getRandomFontStyle } from "@/utils/creatomate/fonts";
import { motion } from "framer-motion";
import { videoCreator } from "@/store/creatomate";

interface RenderProps {
  previewContainerRef: React.RefObject<HTMLDivElement>;
  handleExport: () => void;
  isRendering: boolean;
  isCaptionsGenerated: boolean;
  setIsCaptionsGenerated: (value: boolean) => void;
  selectedVideo: CloudinaryVideo | null;
  selectedTemplate: DefaultSource | null;
  availableVideos: CloudinaryVideo[];
}

const Render: React.FC<RenderProps> = ({
  previewContainerRef,
  handleExport,
  isRendering,
  isCaptionsGenerated,
  setIsCaptionsGenerated,
  selectedVideo,
  selectedTemplate,
  availableVideos,
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isGeneratingCaptions, setIsGeneratingCaptions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const initializePreview = async () => {
      if (
        !previewContainerRef.current ||
        isInitialized ||
        !selectedVideo ||
        !selectedTemplate
      ) {
        return;
      }

      try {
        await videoCreator.initializeVideoPlayer(previewContainerRef.current);
        await videoCreator.setSelectedSource(selectedTemplate);

        // Directly use selectedVideo's url for the preview
        const videoUrl = selectedVideo.url;
        await videoCreator.updateTemplateWithSelectedVideo(
          selectedVideo,
          availableVideos,
        );

        videoCreator.preview!.onTimeChange = (time: number) =>
          setCurrentTime(time);
        videoCreator.preview!.onStateChange = (state) => {
          setDuration(state.duration);
        };

        setIsInitialized(true);
      } catch (err) {
        setError("Failed to initialize editor: " + (err as Error).message);
      }
    };

    initializePreview();
  }, [
    selectedVideo,
    selectedTemplate,
    previewContainerRef,
    isInitialized,
    availableVideos,
  ]);

  const handleGenerateCaptions = async () => {
    if (!selectedVideo) return;

    setIsGeneratingCaptions(true);
    try {
      const captions = await videoCreator.fetchCaptions(
        selectedVideo.url,
        "captions",
      );
      const randomFontStyle = getRandomFontStyle();
      await videoCreator.queueCaptionsUpdate(
        "video1",
        captions,
        randomFontStyle,
      );
      await videoCreator.applyQueuedUpdates();
      setIsCaptionsGenerated(true);
    } catch (err) {
      setError("Failed to generate captions: " + (err as Error).message);
    } finally {
      setIsGeneratingCaptions(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col h-full"
    >
      <div className="flex-grow relative border rounded-t-xl">
        {!isInitialized && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/20 rounded-t-xl">
            <Loader className="h-12 w-12 animate-spin" />
            <p className="text-xl font-bold ml-4">Initializing editor...</p>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/20 rounded-t-xl">
            <p className="text-xl font-bold text-red-600">
              Failed to initialize editor
            </p>
          </div>
        )}
        <div
          ref={previewContainerRef}
          className="relative w-full h-full border rounded-t-xl"
          style={{ height: "28rem" }}
        />
      </div>

      <div className="bg-card p-4 rounded-b-lg">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2 items-center">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => videoCreator.skipBackward()}
                disabled={!isInitialized || !!error}
              >
                <SkipBackIcon className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  videoCreator.isPlaying
                    ? videoCreator.preview?.pause()
                    : videoCreator.preview?.play();
                }}
                disabled={!isInitialized || !!error}
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
                disabled={!isInitialized || !!error}
              >
                <SkipForwardIcon className="w-4 h-4" />
              </Button>
            </div>
            <span className="text-sm font-medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={handleGenerateCaptions}
              className="mt-4"
              disabled={
                !isInitialized ||
                !selectedVideo ||
                isGeneratingCaptions ||
                isCaptionsGenerated ||
                !!error
              }
            >
              <FileTextIcon className="mr-2 w-4 h-4" />
              {isGeneratingCaptions
                ? "Generating Captions..."
                : "Generate Captions"}
            </Button>
            <Button
              onClick={handleExport}
              className="mt-4"
              disabled={
                !isInitialized || isRendering || !isCaptionsGenerated || !!error
              }
            >
              <DownloadIcon className="mr-2 w-4 h-4" />
              {isRendering ? "Rendering..." : "Export Video"}
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={!!error}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>{error}</AlertDialogDescription>
          <AlertDialogFooter>
            <Button onClick={() => setError(null)}>Close</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default Render;
