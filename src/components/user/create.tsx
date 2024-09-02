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
import { AnimatePresence, motion } from "framer-motion";
import {
  DefaultSource,
  defaultSources,
  videoUrls,
} from "@/utils/creatomate/templates";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import Stepper from "./components/stepper";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/component";
import { getRandomFontStyle } from "@/utils/creatomate/fonts";
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

interface GoogleDriveItem {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webContentLink?: string;
}

interface FolderContent {
  [folderId: string]: GoogleDriveItem[];
}

const Create: React.FC<CreateProps> = observer(({ user }) => {
  const router = useRouter();
  const { step } = router.query;

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] =
    useState<DefaultSource | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<GoogleDriveItem | null>(
    null,
  );
  const [isPreviewInitialized, setIsPreviewInitialized] = useState(false);
  const [isCaptionsGenerated, setIsCaptionsGenerated] = useState(false);
  const [isGeneratingCaptions, setIsGeneratingCaptions] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [renderResult, setRenderResult] = useState<any>(null);
  const [showRenderDialog, setShowRenderDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [folderStructure, setFolderStructure] = useState<GoogleDriveItem[]>([]);
  const [folderContents, setFolderContents] = useState<FolderContent>({});
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [defaultFolderId, setDefaultFolderId] = useState<string | null>(null);

  const previewContainerRef = useRef<HTMLDivElement>(null);

  const fetchGoogleDriveContents = async (folderId: string) => {
    setIsLoadingFolders(true);
    setError(null);

    try {
      console.log(`Fetching contents for folder: ${folderId}`);
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&fields=files(id,name,mimeType,thumbnailLink,webContentLink)&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`,
      );

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response data:", JSON.stringify(data, null, 2));

      if (!response.ok) {
        throw new Error(
          `API request failed with status ${response.status}: ${
            data.error?.message || "Unknown error"
          }`,
        );
      }

      setFolderStructure(
        data.files.filter(
          (file: { mimeType: string }) =>
            file.mimeType === "application/vnd.google-apps.folder",
        ) || [],
      );

      if (data.files && data.files.length === 0) {
        console.log("No items found in this folder");
      } else {
        console.log(`Found ${data.files.length} items in the folder`);
      }
    } catch (err) {
      console.error("Error fetching Google Drive contents:", err);
      setError((err as Error).message);
      toast.error("Failed to load contents from Google Drive");
    } finally {
      setIsLoadingFolders(false);
    }
  };

  const fetchFolderContents = async (folderId: string) => {
    setIsLoadingVideos(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'video/'&fields=files(id,name,mimeType,thumbnailLink,webContentLink)&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`,
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      setFolderContents((prev) => ({ ...prev, [folderId]: data.files || [] }));
    } catch (err) {
      console.error("Error fetching folder contents:", err);
      toast.error("Failed to load videos from the folder");
    } finally {
      setIsLoadingVideos(false);
    }
  };

  const handleFolderChange = (folderId: string) => {
    setSelectedFolderId(folderId);
    if (!folderContents[folderId]) {
      fetchFolderContents(folderId);
    }
  };

  useEffect(() => {
    fetchGoogleDriveContents(process.env.NEXT_PUBLIC_GOOGLE_FOLDER as string);
  }, []);

  useEffect(() => {
    const fetchAndSetDefaultFolder = async () => {
      setIsLoadingFolders(true);
      try {
        const response = await fetch(
          `https://www.googleapis.com/drive/v3/files?q='${process.env.NEXT_PUBLIC_GOOGLE_FOLDER}'+in+parents&fields=files(id,name,mimeType)&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`,
        );

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        const folders = data.files.filter(
          (file: { mimeType: string }) =>
            file.mimeType === "application/vnd.google-apps.folder",
        );

        setFolderStructure(folders || []);

        if (folders.length > 0) {
          const defaultFolder = folders[0]; // Select the first folder as default
          setDefaultFolderId(defaultFolder.id);
          setSelectedFolderId(defaultFolder.id);
          fetchFolderContents(defaultFolder.id);
        }
      } catch (err) {
        console.error("Error fetching Google Drive contents:", err);
        setError((err as Error).message);
        toast.error("Failed to load contents from Google Drive");
      } finally {
        setIsLoadingFolders(false);
      }
    };

    fetchAndSetDefaultFolder();
  }, []);

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
    } else {
      setCurrentStep(1);
      updateUrlStep(1);
    }
  }, [step, selectedTemplate, selectedVideo, isCaptionsGenerated]);

  useEffect(() => {
    if (
      currentStep === 3 &&
      !isPreviewInitialized &&
      previewContainerRef.current
    ) {
      initializePreview();
    }
  }, [currentStep, isPreviewInitialized]);

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
      setSelectedTemplate(template);
      await videoCreator.setSelectedSource(template);
      setCurrentStep(2);
      updateUrlStep(2);
    } catch (err) {
      setError("Failed to set template: " + (err as Error).message);
    }
  };

  const handleVideoSelect = async (video: GoogleDriveItem) => {
    try {
      setSelectedVideo(video);
      setIsGeneratingCaptions(true);

      await videoCreator.updateTemplateWithSelectedVideo(
        video.webContentLink!,
        videoUrls,
      );

      const captions = await videoCreator.fetchCaptions(
        video.webContentLink!,
        "video1",
      );
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
      setError("Failed to select video: " + (err as Error).message);
    } finally {
      setIsGeneratingCaptions(false);
    }
  };

  const initializePreview = async () => {
    if (!previewContainerRef.current || isPreviewInitialized) return;

    try {
      await videoCreator.initializeVideoPlayer(previewContainerRef.current);
      setIsPreviewInitialized(true);

      if (selectedTemplate) {
        await videoCreator.setSelectedSource(selectedTemplate);
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
    } catch (err) {
      console.error("Export error:", err);
      setError("Export error: " + (err as Error).message);
      toast.error("Failed to export video. Please try again.");
    } finally {
      setIsRendering(false);
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
                >
                  <SelectTrigger className="max-w-64">
                    <SelectValue placeholder="Select a folder" />
                  </SelectTrigger>
                  <SelectContent>
                    {folderStructure.map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        {folder.name}
                      </SelectItem>
                    ))}
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
                        {folderContents[selectedFolderId]?.map((video) => (
                          <motion.div
                            key={video.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`border p-4 rounded cursor-pointer transition-colors duration-200 ${
                              selectedVideo?.id === video.id
                                ? "border-blue-500 border-2"
                                : "hover:border-blue-500"
                            }`}
                            onClick={() => handleVideoSelect(video)}
                          >
                            <div className="relative w-full h-40 mb-2">
                              {video.thumbnailLink ? (
                                <img
                                  src={video.thumbnailLink}
                                  alt={video.name}
                                  className="w-full h-full object-cover rounded"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded">
                                  <span className="text-gray-500">
                                    No thumbnail
                                  </span>
                                </div>
                              )}
                            </div>
                            <p className="text-center font-medium truncate">
                              {video.name}
                            </p>
                          </motion.div>
                        ))}
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
          if (step <= currentStep) {
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
            <Button
              variant="ghost"
              className="hover:border hover:bg-transparent hover:text-red-500"
              size="icon"
              onClick={() => setError(null)}
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      {renderStep()}
      <Dialog open={showRenderDialog} onOpenChange={setShowRenderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isRendering ? "Rendering Video" : "Render Complete"}
            </DialogTitle>
            <DialogDescription>
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
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            {!isRendering && renderResult && (
              <>
                <DialogClose asChild>
                  <Button
                    onClick={() => window.open(renderResult.url, "_blank")}
                    className="flex items-center"
                  >
                    <Download className="mr-2 h-4 w-4" /> Download Video
                  </Button>
                </DialogClose>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default Create;
