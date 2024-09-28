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
  AlertTriangle,
  CheckCircle,
  DownloadIcon,
  FileTextIcon,
  Loader,
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { DefaultSource } from "@/utils/creatomate/template-types";
import { FontStyle } from "@/utils/creatomate/font-types";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fontStyles } from "@/utils/creatomate/fonts";
import { videoCreator } from "@/store/creatomate";

interface FirebaseVideo {
  id: string;
  public_id: string;
  folder: string;
  url: string;
  secure_url: string;
  thumbnail_url: string;
  duration: number;
  format: string;
  created_at: string;
}

interface RenderProps {
  previewContainerRef: React.RefObject<HTMLDivElement>;
  handleExport: () => Promise<void>;
  isRendering: boolean;
  isCaptionsGenerated: boolean;
  setIsCaptionsGenerated: (value: boolean) => void;
  selectedVideo: FirebaseVideo | null;
  selectedTemplate: DefaultSource | null;
  availableVideos: FirebaseVideo[];
  userCreditInfo: { used_credits: number; total_credits: number } | null;
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
  userCreditInfo,
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isGeneratingCaptions, setIsGeneratingCaptions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedFont, setSelectedFont] = useState(fontStyles[0]);
  const [showFontDialog, setShowFontDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportStep, setExportStep] = useState<
    "confirm" | "rendering" | "complete"
  >("confirm");
  const [renderProgress, setRenderProgress] = useState(0);

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
          setDuration(selectedVideo.duration);

        setIsInitialized(true);
      } catch (err) {
        setError("Failed to initialize editor: " + (err as Error).message);
      }
    };

    initializePreview();
  }, [selectedVideo, selectedTemplate, previewContainerRef, isInitialized]);

  const handleGenerateCaptions = async (selectedFont: FontStyle) => {
    if (!selectedVideo) return;

    setIsGeneratingCaptions(true);
    try {
      const captions = await videoCreator.fetchCaptions(
        selectedVideo.url,
        "captions",
      );
      await videoCreator.addCaptionsAsElements(
        "video1",
        captions,
        selectedFont,
      );
      setIsCaptionsGenerated(true);
    } catch (err) {
      setError("Failed to generate captions: " + (err as Error).message);
    } finally {
      setIsGeneratingCaptions(false);
      setShowFontDialog(false);
    }
  };

  const handleFontChange = async (font: FontStyle) => {
    setSelectedFont(font);
    try {
      if (isCaptionsGenerated) {
        await videoCreator.setFontStyle("video1", font);
      }
    } catch (err) {
      setError("Failed to update font: " + (err as Error).message);
    } finally {
      setShowFontDialog(false);
    }
  };

  const handleExportClick = () => {
    setShowExportDialog(true);
    setExportStep("confirm");
  };

  const handleExportConfirm = async () => {
    setExportStep("rendering");
    try {
      await handleExport();
      // Simulate progress updates (replace with actual progress tracking)
      const interval = setInterval(() => {
        setRenderProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setExportStep("complete");
            return 100;
          }
          return prev + 10;
        });
      }, 1000);
    } catch (error) {
      setError("Export failed: " + (error as Error).message);
      setShowExportDialog(false);
    }
  };

  useEffect(() => {
    if (selectedVideo) {
      setDuration(selectedVideo.duration);
    }
  }, [selectedVideo]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time * 1000) % 1000);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
  };

  const remainingCredits = userCreditInfo
    ? userCreditInfo.total_credits - userCreditInfo.used_credits
    : 0;
  const creditsAfterRender = Math.max(0, remainingCredits - 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex h-full flex-col"
    >
      <div className="relative flex-grow rounded-t-xl border">
        {!isInitialized && !error && (
          <div className="absolute inset-0 flex items-center justify-center rounded-t-xl bg-white/20">
            <Loader className="h-12 w-12 animate-spin" />
            <p className="ml-4 text-xl font-bold">Initializing editor...</p>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center rounded-t-xl bg-white/20">
            <p className="text-xl font-bold text-red-600">
              Failed to initialize editor
            </p>
          </div>
        )}
        <div
          ref={previewContainerRef}
          className="relative h-full w-full rounded-t-xl border"
          style={{ height: "28rem" }}
        />
      </div>

      <div className="rounded-b-lg bg-card p-4">
        <div className="flex flex-col justify-between md:flex-row md:items-center">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => videoCreator.skipBackward()}
                disabled={!isInitialized || !!error}
              >
                <SkipBackIcon className="h-4 w-4" />
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
                  <PauseIcon className="h-4 w-4" />
                ) : (
                  <PlayIcon className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => videoCreator.skipForward()}
                disabled={!isInitialized || !!error}
              >
                <SkipForwardIcon className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-sm font-medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex space-x-2">
            <Button
              disabled={
                !isInitialized || isRendering || !!error || isCaptionsGenerated
              }
              onClick={() => setShowFontDialog(true)}
              className="md:text-md mt-4 text-xs"
            >
              <FileTextIcon className="mr-2 h-4 w-4" />
              {isCaptionsGenerated
                ? "Change Font(Coming soon)"
                : "Generate Captions"}
            </Button>
            <Button
              onClick={handleExportClick}
              className="md:text-md mt-4 text-xs"
              disabled={
                !isInitialized || isRendering || !!error || remainingCredits < 1
              }
            >
              <DownloadIcon className="mr-2 h-4 w-4" />
              Export Video
            </Button>
          </div>
        </div>
      </div>

      {/* Font Selection Dialog */}
      <AlertDialog open={showFontDialog} onOpenChange={setShowFontDialog}>
        <AlertDialogContent className="max-w-md rounded-lg p-6">
          <AlertDialogHeader>
            {!isGeneratingCaptions ? (
              <AlertDialogTitle>Select Font Style</AlertDialogTitle>
            ) : (
              <AlertDialogTitle>Processing...</AlertDialogTitle>
            )}
          </AlertDialogHeader>
          <AlertDialogDescription>
            <AnimatePresence mode="wait">
              {isGeneratingCaptions ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="mx-auto flex h-96 w-full max-w-md flex-col items-center justify-center"
                >
                  <div className="mb-4 flex items-center">
                    <Loader className="mr-3 h-8 w-8 animate-spin text-primary" />
                    <span className="text-xl font-bold">
                      {isCaptionsGenerated
                        ? "Updating Font..."
                        : "Generating Captions..."}
                    </span>
                  </div>
                  <motion.div
                    className="w-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="mb-4 h-2.5 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2.5 rounded-full bg-primary"
                        style={{ width: "50%" }}
                      />
                    </div>
                    <p className="text-center text-sm">Processing...</p>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="font-selection"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <ScrollArea className="h-96 w-full rounded-lg border pr-2">
                    <div className="grid grid-cols-2 gap-4 p-2">
                      {fontStyles.map((font) => (
                        <motion.div
                          key={font.id}
                          className={`cursor-pointer justify-center rounded border bg-white p-2 transition-all duration-200 ${
                            selectedFont.id === font.id
                              ? "border-4 border-primary"
                              : "border-gray-300"
                          } border-2 hover:border-primary`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleFontChange(font)}
                        >
                          <div className="relative h-16 w-full overflow-hidden">
                            <img
                              src={font.preview_image}
                              alt={`Font style ${font.id}`}
                              className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 transform object-cover"
                            />
                          </div>
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
            {!isGeneratingCaptions && (
              <Button onClick={() => setShowFontDialog(false)}>Close</Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Export Dialog */}
      <AlertDialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <AlertDialogContent className="max-w-md rounded-lg p-6">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {exportStep === "confirm" && "Confirm Video Export"}
              {exportStep === "rendering" && "Exporting Video"}
              {exportStep === "complete" && "Export Complete"}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            <AnimatePresence mode="wait">
              {exportStep === "confirm" && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="rounded-lg bg-muted p-4 text-sm">
                    <p className="font-semibold">Credit Usage:</p>
                    <p>Current available credits: {remainingCredits}</p>
                    <p>Credits after this render: {creditsAfterRender}</p>
                  </div>
                  <div className="flex items-center text-sm text-yellow-600">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    <p>This action will use 1 credit and cannot be undone.</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The export process may take several minutes depending on the
                    length and complexity of your video.
                  </p>
                </motion.div>
              )}
              {exportStep === "rendering" && (
                <motion.div
                  key="rendering"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="flex flex-col items-center">
                    <Loader className="mb-4 h-12 w-12 animate-spin text-primary" />
                    <p className="mb-2 text-center text-lg font-semibold">
                      Rendering your video...
                    </p>
                    <Progress value={renderProgress} className="mb-2 w-full" />
                    <p className="text-sm text-muted-foreground">
                      {renderProgress.toFixed(0)}% Complete
                    </p>
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    Feel free to exit and check your dashboard if you don not
                    want to wait for the process to finish.
                  </p>
                </motion.div>
              )}
              {exportStep === "complete" && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="flex flex-col items-center">
                    <CheckCircle className="mb-4 h-12 w-12 text-green-500" />
                    <p className="mb-2 text-center text-lg font-semibold">
                      Export Successful!
                    </p>
                    <p className="text-center text-sm text-muted-foreground">
                      Your video has been successfully exported and is ready for
                      download.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </AlertDialogDescription>
          <AlertDialogFooter>
            {exportStep === "confirm" && (
              <>
                <Button
                  onClick={() => setShowExportDialog(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleExportConfirm}
                  disabled={remainingCredits < 1}
                >
                  Confirm Export
                </Button>
              </>
            )}
            {exportStep === "rendering" && (
              <Button disabled>Exporting...</Button>
            )}
            {exportStep === "complete" && (
              <Button onClick={() => setShowExportDialog(false)}>Close</Button>
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
