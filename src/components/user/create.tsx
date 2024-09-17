// src/components/user/create.tsx
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
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getVideoUrl, videoCreator } from "@/store/creatomate";

import { Button } from "@/components/ui/button";
import { PinataSDK } from "pinata";
import Stepper from "./components/stepper";
import { User } from "@supabase/supabase-js";
import VideoViewer from "./components/video-popup";
import { createClient } from "@/utils/supabase/component";
import { getRandomFontStyle } from "@/utils/creatomate/fonts";
import { observer } from "mobx-react-lite";
import { toast } from "sonner";
import { useRouter } from "next/router";

const stepTitles = [
  "Select a Template",
  "Choose Your Clip",
  "Edit & Render",
  "Finished",
];

interface CreateProps {
  user: User;
}

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL!,
});

const Create: React.FC<CreateProps> = observer(({ user }) => {
  const router = useRouter();
  const { step } = router.query;

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] =
    useState<DefaultSource | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VimeoVideo | null>(null);
  const [isPreviewInitialized, setIsPreviewInitialized] = useState(false);
  const [isCaptionsGenerated, setIsCaptionsGenerated] = useState(false);
  const [isGeneratingCaptions, setIsGeneratingCaptions] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [renderResult, setRenderResult] = useState<any>(null);
  const [showRenderDialog, setShowRenderDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [folderStructure, setFolderStructure] = useState<VimeoFolder[]>([]);
  const [folderContents, setFolderContents] = useState<
    Record<string, VimeoVideo[]>
  >({});
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [defaultFolderId, setDefaultFolderId] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isVideoViewerOpen, setIsVideoViewerOpen] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hoveredVideo, setHoveredVideo] = useState<VimeoVideo | null>(null);

  useEffect(() => {
    if ((isGeneratingCaptions || isRendering) && !isError) {
      setShowRenderDialog(true);
    } else {
      setShowRenderDialog(false);
    }
  }, [isGeneratingCaptions, isRendering, isError]);

  useEffect(() => {
    const supabase = createClient();
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (user) {
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
      isCaptionsGenerated
    ) {
      setCurrentStep(3);
    } else if (stepNumber === 4 && isFinished) {
      setCurrentStep(4);
    } else if (stepNumber !== 4) {
      setCurrentStep(1);
      updateUrlStep(1);
    }
  }, [step, selectedTemplate, selectedVideo, isCaptionsGenerated, isFinished]);

  useEffect(() => {
    if (
      currentStep === 3 &&
      !isPreviewInitialized &&
      previewContainerRef.current
    ) {
      initializePreview();
    }
  }, [currentStep, isPreviewInitialized]);

  const getBetterQualityThumbnail = (sizes: any[]) => {
    return sizes.reduce(
      (best: { width: number }, current: { width: number; height: number }) => {
        if (
          current.width <= 640 &&
          current.height <= 360 &&
          current.width > best.width
        ) {
          return current;
        }
        return best;
      },
      sizes[0],
    );
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const fetchVimeoFolders = async () => {
      setIsLoadingFolders(true);
      setError(null);
      try {
        const response = await fetch("/api/vimeo/folders");
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const data: VimeoAPIResponse = await response.json();
        setFolderContents(data);

        // Set default folder (Kick Clips if available, otherwise first folder)
        const folderIds = Object.keys(data);
        const defaultFolderId = folderIds.includes("22018591")
          ? "22018591"
          : folderIds[0];
        setSelectedFolderId(defaultFolderId);
      } catch (err) {
        console.error("Error fetching Vimeo folders:", err);
        setError((err as Error).message);
      } finally {
        setIsLoadingFolders(false);
      }
    };

    fetchVimeoFolders();
  }, []);

  const handleFolderChange = (folderId: string) => {
    setSelectedFolderId(folderId);
  };

  const updateUrlStep = useCallback(
    (stepNumber: number) => {
      router.push(`/user/create?step=${stepNumber}`, undefined, {
        shallow: true,
      });
    },
    [router],
  );

  const handleTemplateSelect = async (template: DefaultSource) => {
    try {
      console.log("Selected template:", template);
      setSelectedTemplate(template);
      await videoCreator.setSelectedSource(template);
      setCurrentStep(2);
      updateUrlStep(2);
    } catch (err) {
      setError("Failed to set template: " + (err as Error).message);
      setIsError(true);
    }
  };

  const handleVideoSelect = async (video: VimeoVideo) => {
    try {
      setIsBusy(true);
      setSelectedVideo(video);

      const videoUrl = getVideoUrl(video);
      setSelectedVideoUrl(videoUrl);
      setIsGeneratingCaptions(true);
      setProgress(0);

      await videoCreator.updateTemplateWithSelectedVideo(
        video,
        folderContents[selectedFolderId!],
      );

      const captions = await videoCreator.fetchCaptions(videoUrl, "video1");

      const randomFontStyle = getRandomFontStyle();
      await videoCreator.queueCaptionsUpdate(
        "video1",
        captions,
        randomFontStyle,
      );

      setIsCaptionsGenerated(true);
      toast.success("Video selected and captions generated successfully");
      setCurrentStep(3);
      updateUrlStep(3);
    } catch (err) {
      console.error("Error selecting video:", err);
      setError("Failed to select video: " + (err as Error).message);
      setIsError(true);
      toast.error("Failed to select video: " + (err as Error).message);
    } finally {
      setIsGeneratingCaptions(false);
      setIsBusy(false);
    }
  };

  const handleExport = async () => {
    try {
      setIsRendering(true);
      setShowRenderDialog(true);
      const jobId = await videoCreator.finishVideo();
      console.log("Job ID received:", jobId);
      const renderResult = await videoCreator.checkRenderStatus(jobId);
      console.log("Render result:", renderResult);
      setRenderResult(renderResult);
      toast.success("Video exported successfully");
      setIsFinished(true);
      setCurrentStep(4);
      updateUrlStep(4);
    } catch (err) {
      console.error("Export error:", err);
      setError("Export error: " + (err as Error).message);
      setIsError(true);
    } finally {
      setIsRendering(false);
    }
  };

  const initializePreview = async () => {
    if (!previewContainerRef.current || isPreviewInitialized) return;

    try {
      await videoCreator.initializeVideoPlayer(previewContainerRef.current);
      setIsPreviewInitialized(true);

      if (selectedTemplate && selectedVideo) {
        await videoCreator.setSelectedSource(selectedTemplate);
        await videoCreator.updateTemplateWithSelectedVideo(
          selectedVideo,
          folderContents[selectedFolderId!],
        );
      }

      await videoCreator.applyQueuedUpdates();

      videoCreator.preview!.onTimeChange = (time: number) =>
        setCurrentTime(time);
      videoCreator.preview!.onStateChange = (state) =>
        setDuration(state.duration);
    } catch (error) {
      setError(
        "Failed to initialize video player: " + (error as Error).message,
      );
    }
  };

  const handleCreateAnother = () => {
    setIsFinished(false);
    setCurrentStep(1);
    updateUrlStep(1);
    setSelectedTemplate(null);
    setSelectedVideo(null);
    setIsCaptionsGenerated(false);
    setIsPreviewInitialized(false);
    setRenderResult(null);
  };

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`Failed to fetch the file. Status: ${response.status}`);

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      const fileName = url.split("/").pop() || "download";
      anchor.href = blobUrl;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(anchor);
      console.log(`File "${fileName}" downloaded successfully.`);
    } catch (error) {
      console.error("Failed to download file:", error);
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
            className="space-y-8"
          >
            {isLoadingFolders ? (
              <div className="flex items-center justify-center">
                <Loader className="h-8 w-8 animate-spin mr-2" />
                <p>Loading folders...</p>
              </div>
            ) : (
              <>
                <Select
                  onValueChange={handleFolderChange}
                  value={selectedFolderId || undefined}
                  disabled={isBusy}
                >
                  <SelectTrigger className="max-w-64">
                    <SelectValue placeholder="Select a folder" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="22018591">Kick Clips</SelectItem>
                    <SelectItem value="22018601">Snap Clips</SelectItem>
                    <SelectItem value="22018599">B-Roll Clips</SelectItem>
                    <SelectItem value="22018597">TikTok Clips</SelectItem>
                  </SelectContent>
                </Select>

                {selectedFolderId && (
                  <div>
                    {isLoadingVideos ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader className="h-6 w-6 animate-spin mr-2" />
                        <p>Loading videos...</p>
                      </div>
                    ) : folderContents[selectedFolderId]?.length === 0 ? (
                      <p className="text-center p-4">
                        No videos found in this folder.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
                        {folderContents[selectedFolderId]?.map(
                          (video: VimeoVideo) => (
                            <motion.div
                              key={video.uri}
                              whileHover={{ scale: isBusy ? 1 : 1.05 }}
                              whileTap={{ scale: isBusy ? 1 : 0.95 }}
                              className={`border p-4 rounded cursor-pointer transition-colors duration-200 ${
                                selectedVideo?.uri === video.uri
                                  ? "border-blue-500 border-2"
                                  : "hover:border-blue-500"
                              } ${
                                isBusy ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                              onClick={() =>
                                !isBusy && handleVideoSelect(video)
                              }
                            >
                              <div className="relative w-full h-40 mb-2 overflow-hidden rounded">
                                {video.pictures.sizes.length > 0 ? (
                                  <img
                                    src={
                                      getBetterQualityThumbnail(
                                        video.pictures.sizes,
                                      ).link
                                    }
                                    alt={video.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                    <span className="text-gray-500">
                                      No thumbnail
                                    </span>
                                  </div>
                                )}
                                <div className="absolute bottom-0 right-0 bg-black bg-opacity-60 text-white px-2 py-1 text-sm rounded-tl">
                                  {formatDuration(video.duration)}
                                </div>
                              </div>
                              <p className="text-center font-medium truncate">
                                {video.name}
                              </p>
                            </motion.div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
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
                ref={previewContainerRef}
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
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center"
          >
            <h2 className="text-2xl font-bold mb-4">Video Creation Complete</h2>
            <div className="p-6 rounded-lg mb-6 w-full max-w-2xl bg-card">
              <h3 className="text-xl font-semibold mb-3">Render Summary</h3>
              {isRendering ? (
                <div className="flex items-center">
                  <Loader className="animate-spin mr-2" />
                  <p>
                    Your video is being rendered. This may take a few minutes...
                  </p>
                </div>
              ) : renderResult ? (
                <>
                  <p className="mb-4">
                    Your video has been rendered successfully!
                  </p>
                  <div className="flex space-x-4 mb-4">
                    <Button
                      onClick={() => setIsVideoViewerOpen(true)}
                      className="flex-1"
                    >
                      Preview Video
                    </Button>
                    <Button
                      onClick={() => handleDownload(renderResult.url)}
                      className="flex-1"
                    >
                      <Download className="mr-2 h-4 w-4" /> Download Video
                    </Button>
                  </div>
                </>
              ) : (
                <p>No render information available.</p>
              )}
            </div>
            <div className="flex flex-col items-center">
              <p className="mb-4 text-center">
                Would you like to create another video?
              </p>
              <div className="flex space-x-4">
                <Button onClick={handleCreateAnother} variant="outline">
                  Create Another Video
                </Button>
                <Button onClick={() => router.push("/user/created")}>
                  View Your Created
                </Button>
              </div>
            </div>

            {renderResult && (
              <VideoViewer
                isOpen={isVideoViewerOpen}
                onClose={() => setIsVideoViewerOpen(false)}
                videoUrl={renderResult.url}
              />
            )}
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
        onStepClick={(step) => {
          if (step <= currentStep && !isFinished) {
            setCurrentStep(step);
            updateUrlStep(step);
          }
        }}
        isLoading={isGeneratingCaptions || isRendering}
        loadingStep={isGeneratingCaptions ? 2 : isRendering ? 3 : 0}
        loadingMessage={
          isGeneratingCaptions
            ? "Generating captions..."
            : isRendering
              ? "Rendering video..."
              : ""
        }
        isFinished={isFinished}
        isError={isError}
        progress={progress}
      />
      <AnimatePresence mode="wait">
        <AlertDialog open={!!error} onOpenChange={() => setError(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center text-red-600">
                <AlertCircle className="w-5 h-5 mr-2" />
                Error
              </AlertDialogTitle>
              <AlertDialogDescription className="text-red-600">
                {error}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setError(null)}>
                Close
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </AnimatePresence>
      {renderStep()}
    </div>
  );
});

export default Create;
