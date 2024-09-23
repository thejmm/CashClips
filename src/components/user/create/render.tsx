// src/components/user/create/render.tsx
import {
  AlertDialog,
  AlertDialogAction,
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
import { getVideoUrl, videoCreator } from "@/store/creatomate";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { DefaultSource } from "@/utils/creatomate/template-types";
import { VimeoVideo } from "@/types/vimeo";
import { motion } from "framer-motion";

interface RenderProps {
  isPreviewInitialized: boolean;
  previewContainerRef: React.RefObject<HTMLDivElement>;
  currentTime: number;
  duration: number;
  formatTime: (time: number) => string;
  handleExport: () => void;
  isRendering: boolean;
  isCaptionsGenerated: boolean;
  selectedVideo: VimeoVideo | null;
  selectedTemplate: DefaultSource | null;
}

const Render: React.FC<RenderProps> = ({
  isPreviewInitialized,
  previewContainerRef,
  currentTime,
  duration,
  formatTime,
  handleExport,
  isRendering,
  isCaptionsGenerated,
  selectedVideo,
  selectedTemplate,
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isGeneratingCaptions, setIsGeneratingCaptions] = useState(false);
  const [showCaptionDialog, setShowCaptionDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false); // Track dialog state separately

  useEffect(() => {
    const initializePreview = async () => {
      if (
        !previewContainerRef.current ||
        isInitialized ||
        !selectedVideo ||
        !selectedTemplate
      )
        return;

      try {
        // Initialize video player
        await videoCreator.initializeVideoPlayer(previewContainerRef.current);
        setIsInitialized(true);

        // Apply selected template and video to the preview
        const videoUrl = getVideoUrl(selectedVideo);
        await videoCreator.setSelectedSource(selectedTemplate);
        await videoCreator.updateTemplateWithSelectedVideo(
          { ...selectedVideo, uri: videoUrl },
          [] // Add additional videos as needed
        );
        await videoCreator.applyQueuedUpdates();
      } catch (err) {
        console.error("Error initializing video preview:", err);
        setError("Failed to initialize editor.");
        setIsInitialized(false); // Ensure buttons remain disabled if there's an error
        setIsErrorDialogOpen(true); // Open error dialog
      }
    };

    initializePreview();
  }, [selectedVideo, selectedTemplate, previewContainerRef, isInitialized]);

  const handleGenerateCaptions = async () => {
    if (!selectedVideo) return;

    setIsGeneratingCaptions(true);
    setShowCaptionDialog(true);

    try {
      const videoUrl = getVideoUrl(selectedVideo);
      await videoCreator.fetchCaptions(videoUrl, "element-id");
      setShowCaptionDialog(false);
      setIsGeneratingCaptions(false);
    } catch (err) {
      setError("Failed to generate captions");
      setIsGeneratingCaptions(false);
      setShowCaptionDialog(false);
      setIsErrorDialogOpen(true); // Open error dialog
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col h-full"
    >
      {/* Video Preview */}
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

      {/* Video Control Bar */}
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
            {/* Caption Generation Button */}
            <Button
              onClick={handleGenerateCaptions}
              className="mt-4"
              disabled={
                !isInitialized ||
                !selectedVideo ||
                isGeneratingCaptions ||
                !!error
              }
            >
              <FileTextIcon className="mr-2 w-4 h-4" />
              {isGeneratingCaptions
                ? "Generating Captions..."
                : "Generate Captions"}
            </Button>

            {/* Export Button */}
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

      {/* Error Handling Alert Dialog */}
      {error && (
        <>
          <AlertDialog
            open={isErrorDialogOpen}
            onOpenChange={setIsErrorDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Error</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription>
                {error} {/* Display the actual error message */}
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogAction onClick={() => setIsErrorDialogOpen(false)}>
                  Close
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {/* Caption Fetching Dialog */}
      <AlertDialog open={showCaptionDialog} onOpenChange={setShowCaptionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Fetching Captions</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Please wait while we generate captions for your video...
          </AlertDialogDescription>
          <Loader className="h-8 w-8 animate-spin mx-auto mt-4" />
          <AlertDialogFooter>
            <AlertDialogAction disabled>Please Wait...</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default Render;
