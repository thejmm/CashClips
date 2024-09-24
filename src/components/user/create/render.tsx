// src\components\user\create\render.tsx
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AnimatePresence, motion } from "framer-motion";
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
import { CloudinaryVideo } from "@/types/cloudinary";
import { DefaultSource } from "@/utils/creatomate/template-types";
import { FontStyle } from "@/utils/creatomate/font-types";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fontStyles } from "@/utils/creatomate/fonts";
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
  const [selectedFont, setSelectedFont] = useState(fontStyles[0]);
  const [showFontDialog, setShowFontDialog] = useState(false);

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
        await videoCreator.updateTemplateWithSelectedVideo(selectedVideo);

        videoCreator.preview!.onTimeChange = (time: number) =>
          setCurrentTime(time);
        videoCreator.preview!.onStateChange = (state) =>
          setDuration(state.duration);

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
        "captions"
      );
      await videoCreator.queueCaptionsUpdate(
        "video1",
        captions,
        selectedFont.styles as FontStyle
      );
      await videoCreator.applyQueuedUpdates();
      setIsCaptionsGenerated(true);
    } catch (err) {
      setError("Failed to generate captions: " + (err as Error).message);
    } finally {
      setIsGeneratingCaptions(false);
      setShowFontDialog(false);
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
                onClick={() =>
                  videoCreator.isPlaying
                    ? videoCreator.preview?.pause()
                    : videoCreator.preview?.play()
                }
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
              disabled={
                !isInitialized || isRendering || isCaptionsGenerated || !!error
              }
              onClick={() => setShowFontDialog(true)}
              className="mt-4"
            >
              <FileTextIcon className="mr-2 w-4 h-4" />
              Generate Captions
            </Button>
            <Button
              onClick={handleExport}
              className="mt-4"
              disabled={!isInitialized || isRendering || !!error}
            >
              <DownloadIcon className="mr-2 w-4 h-4" />
              {isRendering ? "Rendering..." : "Export Video"}
            </Button>
          </div>
        </div>
      </div>

      {/* Font Selection Dialog */}
      <AlertDialog open={showFontDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Select Font Style</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            <AnimatePresence mode="wait">
              {isGeneratingCaptions ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-col items-center justify-center h-96 w-full max-w-md mx-auto"
                >
                  <div className="flex items-center mb-4">
                    <Loader className="h-8 w-8 animate-spin text-blue-500 mr-3" />
                    <span className="text-xl font-bold">
                      Generating Captions...
                    </span>
                  </div>
                  <motion.div
                    className="w-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Progress value={0} className="h-2 w-full bg-gray-200" />
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="font-selection"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <ScrollArea className="border rounded-lg h-96 w-full pr-2">
                    <div className="grid grid-cols-2 gap-4 p-2">
                      {fontStyles.map((font) => (
                        <motion.div
                          key={font.id}
                          className={`border justify-center p-2 rounded cursor-pointer bg-white transition-all duration-200 ${
                            selectedFont.id === font.id
                              ? "border-blue-500 border-4"
                              : "border-gray-300"
                          } hover:border-blue-500 border-2`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedFont(font);
                            handleGenerateCaptions();
                          }}
                        >
                          <img
                            src={font.preview_image}
                            alt={`Font style ${font.id}`}
                            className="w-auto justify-center mx-auto h-16 object-fit mb-2"
                          />
                          <p className="text-center">Font {font.id}</p>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </motion.div>
              )}
            </AnimatePresence>
          </AlertDialogDescription>
          <AlertDialogFooter>
            {!isGeneratingCaptions ? (
              <Button onClick={() => setShowFontDialog(false)}>Close</Button>
            ) : (
              <Button
                disabled={isGeneratingCaptions}
                onClick={() => setShowFontDialog(false)}
              >
                Finish
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Error Dialog */}
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
