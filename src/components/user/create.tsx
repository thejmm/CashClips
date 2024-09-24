// src/components/user/create.tsx
import { AnimatePresence, motion } from "framer-motion";
import { DefaultSource, defaultSources } from "@/utils/creatomate/templates";
import React, { useEffect, useRef, useState } from "react";

import Clips from "./create/clips";
import { CloudinaryVideo } from "@/types/cloudinary";
import Finish from "./create/finish";
import Render from "./create/render";
import Stepper from "./components/stepper";
import Streamer from "./create/streamer";
import Template from "./create/template";
import { User } from "@supabase/supabase-js";
import { videoCreator } from "@/store/creatomate";

interface CreateProps {
  user: User;
}

const Create: React.FC<CreateProps> = ({ user }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedStreamer, setSelectedStreamer] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<CloudinaryVideo | null>(
    null,
  );
  const [availableVideos, setAvailableVideos] = useState<CloudinaryVideo[]>([]);
  const [selectedTemplate, setSelectedTemplate] =
    useState<DefaultSource | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [isCaptionsGenerated, setIsCaptionsGenerated] = useState(false);
  const [renderResult, setRenderResult] = useState<any>(null);
  const [isVideoViewerOpen, setIsVideoViewerOpen] = useState(false);

  const previewContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      videoCreator.setUserId(user.id);
    }
    console.log("Create component mounted. User ID set:", user?.id);
  }, [user]);

  const handleCreateAnother = () => {
    setCurrentStep(1);
    setSelectedStreamer(null);
    setSelectedFolderId(null);
    setSelectedVideo(null);
    setAvailableVideos([]);
    setSelectedTemplate(null);
    setIsCaptionsGenerated(false);
    setRenderResult(null);
  };

  const handleExport = async () => {
    setIsRendering(true);
    try {
      const jobId = await videoCreator.finishVideo();
      const result = await videoCreator.checkRenderStatus(jobId);
      setRenderResult(result);
      setCurrentStep(5); // Move to the finish step after rendering
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setIsRendering(false);
    }
  };

  const handleVideoSelect = (video: CloudinaryVideo) => {
    setSelectedVideo(video);
    setCurrentStep(3); // Move to the template selection step
  };

  const handleTemplateSelect = (template: DefaultSource) => {
    setSelectedTemplate(template);
    setCurrentStep(4); // Move to the render step
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Streamer
            selectedStreamer={selectedStreamer}
            handleStreamerSelect={(streamer) => {
              setSelectedStreamer(streamer);
              setCurrentStep(2); // Move to the clip selection step
            }}
          />
        );
      case 2:
        return (
          <Clips
            selectedStreamer={selectedStreamer}
            selectedFolderId={selectedFolderId}
            handleFolderChange={setSelectedFolderId}
            handleVideoSelect={handleVideoSelect} // Updated to call the new function
            selectedVideo={selectedVideo}
            setAvailableVideos={setAvailableVideos}
          />
        );
      case 3:
        return (
          <Template
            selectedTemplate={selectedTemplate}
            handleTemplateSelect={handleTemplateSelect} // Updated to call the new function
            defaultSources={defaultSources}
          />
        );
      case 4:
        return (
          <Render
            previewContainerRef={previewContainerRef}
            handleExport={handleExport}
            isRendering={isRendering}
            isCaptionsGenerated={isCaptionsGenerated}
            setIsCaptionsGenerated={setIsCaptionsGenerated}
            selectedVideo={selectedVideo}
            selectedTemplate={selectedTemplate}
            availableVideos={availableVideos}
          />
        );
      case 5:
        return (
          <Finish
            renderResult={renderResult}
            handleCreateAnother={handleCreateAnother}
            isVideoViewerOpen={isVideoViewerOpen}
            setIsVideoViewerOpen={setIsVideoViewerOpen}
          />
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
        {
          [
            "Pick Your Streamer",
            "Choose Your Clip",
            "Select a Template",
            "Edit & Render",
            "Finished",
          ][currentStep - 1]
        }
      </motion.h1>
      <Stepper
        steps={[
          "Pick Your Streamer",
          "Choose Your Clip",
          "Select a Template",
          "Edit & Render",
          "Finished",
        ]}
        currentStep={currentStep}
        onStepClick={setCurrentStep}
        isLoading={isRendering}
        loadingStep={isRendering ? 4 : 0}
        loadingMessage={isRendering ? "Rendering..." : ""}
        isFinished={currentStep === 5}
        isError={false}
      />
      <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
    </div>
  );
};

export default Create;
