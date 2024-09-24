import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { DefaultSource, defaultSources } from "@/utils/creatomate/templates";
import React, { useEffect, useRef, useState } from "react";

import { CashClipsPricing } from "../landing/pricing";
import Clips from "./create/clips";
import { CloudinaryVideo } from "@/types/cloudinary";
import Finish from "./create/finish";
import Render from "./create/render";
import Stepper from "./components/stepper";
import Streamer from "./create/streamer";
import Template from "./create/template";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/component";
import { videoCreator } from "@/store/creatomate";

interface CreateProps {
  user: User;
}

interface UserCreditInfo {
  used_credits: number;
  total_credits: number;
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
  const [error, setError] = useState<string | null>(null);
  const [userCreditInfo, setUserCreditInfo] = useState<UserCreditInfo | null>(
    null,
  );

  const previewContainerRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    if (user) {
      videoCreator.setUserId(user.id);
      fetchUserCreditInfo();
    }
  }, [user]);

  const fetchUserCreditInfo = async () => {
    try {
      const { data, error } = await supabase
        .from("user_data")
        .select("used_credits, total_credits")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      setUserCreditInfo(data as UserCreditInfo);
    } catch (error) {
      console.error("Error fetching user credit info:", error);
      setError("Failed to load user credit information.");
    }
  };

  const handleCreateAnother = () => {
    setCurrentStep(1);
    setSelectedStreamer(null);
    setSelectedFolderId(null);
    setSelectedVideo(null);
    setAvailableVideos([]);
    setSelectedTemplate(null);
    setIsCaptionsGenerated(false);
    setRenderResult(null);
    setError(null);
    fetchUserCreditInfo(); // Refresh credit info
  };

  const handleStepChange = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  const handleExport = async () => {
    setIsRendering(true);
    setError(null);
    try {
      const jobId = await videoCreator.finishVideo();
      const result = await videoCreator.checkRenderStatus(jobId);
      setRenderResult(result);
      setCurrentStep(5);
      fetchUserCreditInfo(); // Refresh credit info after successful render
    } catch (error) {
      console.error("Export error:", error);
      setError((error as Error).message || "An unknown error occurred");
    } finally {
      setIsRendering(false);
    }
  };

  const handleVideoSelect = (video: CloudinaryVideo) => {
    setSelectedVideo(video);
    setCurrentStep(3);
  };

  const handleTemplateSelect = (template: DefaultSource) => {
    setSelectedTemplate(template);
    setCurrentStep(4);
  };

  const renderStep = () => {
    if (
      userCreditInfo &&
      userCreditInfo.used_credits >= userCreditInfo.total_credits
    ) {
      return (
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gradient-to-r from-purple-600 to-blue-500">
            Wow! You are on a roll! 🚀
          </h2>
          <p className="text-xl">
            You have used{" "}
            <span className="font-bold text-blue-500">
              {userCreditInfo.used_credits}
            </span>{" "}
            out of{" "}
            <span className="font-bold text-blue-500">
              {userCreditInfo.total_credits}
            </span>{" "}
            credits this month.
          </p>
          <p className="text-lg">
            Looks like you are loving Cash Clips as much as we do! 😊
          </p>
          <p className="text-lg">
            Ready to take your content creation to the next level?
          </p>
          <p className="text-sm text-gray-600 mt-4">
            Your credits will refresh when your billing cycle resets.
          </p>
          <CashClipsPricing />
        </div>
      );
    }

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
            handleVideoSelect={handleVideoSelect}
            selectedVideo={selectedVideo}
            setAvailableVideos={setAvailableVideos}
          />
        );
      case 3:
        return (
          <Template
            selectedTemplate={selectedTemplate}
            handleTemplateSelect={handleTemplateSelect}
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
        onStepClick={handleStepChange}
        isLoading={isRendering}
        loadingStep={isRendering ? 4 : 0}
        loadingMessage={isRendering ? "Rendering..." : ""}
        isFinished={currentStep === 5}
        isError={
          !!error ||
          (userCreditInfo &&
            userCreditInfo.used_credits >= userCreditInfo.total_credits)
        }
      />
      <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>

      <AlertDialog open={!!error}>
        <AlertDialogContent>
          <AlertDialogDescription>{error}</AlertDialogDescription>
          <AlertDialogAction onClick={() => setError(null)}>
            OK
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Create;
