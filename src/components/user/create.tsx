import { AnimatePresence, motion } from "framer-motion";
import { DefaultSource, defaultSources } from "@/utils/creatomate/templates";
import { useEffect, useRef, useState } from "react";

import Clips from "./create/clips";
import Finish from "./create/finish";
import Render from "./create/render";
import Stepper from "./components/stepper";
import Streamer from "./create/streamer";
import Template from "./create/template";
import { User } from "@supabase/supabase-js";
import { VimeoVideo } from "@/types/vimeo"; // Import VimeoVideo from the correct file
import { useRouter } from "next/router";

interface CreateProps {
  user: User;
}

const Create: React.FC<CreateProps> = () => {
  const router = useRouter();
  const { step } = router.query;
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedStreamer, setSelectedStreamer] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VimeoVideo | null>(null);
  const [selectedTemplate, setSelectedTemplate] =
    useState<DefaultSource | null>(null);

  // Create a ref for the preview container
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Set the current step from the URL, or default to 1
  useEffect(() => {
    const stepNumber = step ? Number(step) : 1;
    setCurrentStep(stepNumber);
  }, [step]);

  // Reset the process for creating another video
  const handleCreateAnother = () => {
    setCurrentStep(1);
    setSelectedTemplate(null);
    setSelectedVideo(null);
    setSelectedStreamer(null);
    setSelectedFolderId(null);
  };

  // Render the appropriate step based on the current state
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Streamer
            selectedStreamer={selectedStreamer}
            handleStreamerSelect={(streamer) => {
              setSelectedStreamer(streamer);
              setCurrentStep(2);
            }}
          />
        );
      case 2:
        return (
          <Clips
            selectedStreamer={selectedStreamer}
            selectedFolderId={selectedFolderId}
            handleFolderChange={setSelectedFolderId}
            handleVideoSelect={(video) => {
              setSelectedVideo(video);
              setCurrentStep(3);
            }}
            selectedVideo={selectedVideo}
          />
        );
      case 3:
        return (
          <Template
            selectedTemplate={selectedTemplate}
            handleTemplateSelect={(template) => {
              setSelectedTemplate(template);
              setCurrentStep(4);
            }}
            defaultSources={defaultSources}
          />
        );
      case 4:
        return (
          <Render
            isPreviewInitialized={false}
            currentTime={0}
            duration={selectedVideo ? selectedVideo.duration : 100}
            formatTime={(time: number) => {
              const minutes = Math.floor(time / 60);
              const seconds = Math.floor(time % 60);
              return `${minutes}:${seconds.toString().padStart(2, "0")}`;
            }}
            handleExport={() => {}}
            isRendering={false}
            isCaptionsGenerated={true}
            previewContainerRef={previewContainerRef}
            selectedVideo={selectedVideo}
            selectedTemplate={selectedTemplate}
          />
        );
      case 5:
        return (
          <Finish
            renderResult={null}
            handleDownload={() => {}}
            handleCreateAnother={handleCreateAnother}
            isVideoViewerOpen={false}
            setIsVideoViewerOpen={() => {}}
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
        isLoading={false}
        loadingStep={0}
        loadingMessage="Loading..."
        isFinished={false}
        isError={false}
      />
      <AnimatePresence>{renderStep()}</AnimatePresence>
    </div>
  );
};

export default Create;
