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
import Finish from "./create/finish";
import Render from "./create/render";
import Stepper from "./components/stepper";
import Streamer from "./create/streamer";
import Template from "./create/template";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/component";
import { useRouter } from "next/router";
import { videoCreator } from "@/store/creatomate";

interface CreateProps {
  user: User;
}

interface UserCreditInfo {
  used_credits: number;
  total_credits: number;
}

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

const steps = [
  "pick-streamer",
  "choose-clip",
  "select-template",
  "edit-render",
  "finished",
];

const Create: React.FC<CreateProps> = ({ user }) => {
  const router = useRouter();
  const { step } = router.query;

  const [selectedStreamer, setSelectedStreamer] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<FirebaseVideo | null>(
    null,
  );
  const [availableVideos, setAvailableVideos] = useState<FirebaseVideo[]>([]);
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

  useEffect(() => {
    if (!step || !steps.includes(step as string)) {
      router.push({ query: { step: steps[0] } });
      return;
    }

    const currentStepIndex = steps.indexOf(step as string);

    if (currentStepIndex > 0 && !selectedStreamer) {
      router.push({ query: { step: steps[0] } });
    } else if (currentStepIndex > 1 && !selectedVideo) {
      router.push({ query: { step: steps[1] } });
    } else if (currentStepIndex > 2 && !selectedTemplate) {
      router.push({ query: { step: steps[2] } });
    }
  }, [step, selectedStreamer, selectedVideo, selectedTemplate, router]);

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
    router.push({ query: { step: steps[0] } });
    setSelectedStreamer(null);
    setSelectedVideo(null);
    setAvailableVideos([]);
    setSelectedTemplate(null);
    setIsCaptionsGenerated(false);
    setRenderResult(null);
    setError(null);
    fetchUserCreditInfo();
    videoCreator.resetStore();
  };

  const handleStepChange = (stepIndex: number) => {
    const targetStep = steps[stepIndex];
    if (stepIndex > 0 && !selectedStreamer) return;
    if (stepIndex > 1 && !selectedVideo) return;
    if (stepIndex > 2 && !selectedTemplate) return;
    router.push({ query: { step: targetStep } });
  };

  const handleExport = async () => {
    setIsRendering(true);
    setError(null);
    try {
      const jobId = await videoCreator.finishVideo();
      const result = await videoCreator.checkRenderStatus(jobId);
      setRenderResult(result);
      router.push({ query: { step: steps[4] } });
      fetchUserCreditInfo();
    } catch (error) {
      console.error("Export error:", error);
      setError((error as Error).message || "An unknown error occurred");
    } finally {
      setIsRendering(false);
    }
  };

  const handleVideoSelect = (video: FirebaseVideo) => {
    setSelectedVideo(video);
    router.push({ query: { step: steps[2] } });
  };

  const handleTemplateSelect = (template: DefaultSource) => {
    setSelectedTemplate(template);
    router.push({ query: { step: steps[3] } });
  };

  const renderStep = () => {
    if (
      userCreditInfo &&
      userCreditInfo.used_credits >= userCreditInfo.total_credits
    ) {
      return (
        <div className="space-y-4 text-center">
          <h2 className="text-gradient-to-r from-purple-600 to-blue-500 text-3xl font-bold">
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
          <p className="mt-4 text-sm text-gray-600">
            Your credits will refresh when your billing cycle resets.
          </p>
          <CashClipsPricing />
        </div>
      );
    }

    switch (step) {
      case "pick-streamer":
        return (
          <Streamer
            selectedStreamer={selectedStreamer}
            handleStreamerSelect={(streamer) => {
              setSelectedStreamer(streamer.folder as any);
              router.push({ query: { step: steps[1] } });
            }}
          />
        );
      case "choose-clip":
        return (
          <Clips
            selectedStreamer={selectedStreamer}
            handleVideoSelect={handleVideoSelect}
            selectedVideo={selectedVideo}
            setAvailableVideos={setAvailableVideos}
          />
        );
      case "select-template":
        return (
          <Template
            selectedTemplate={selectedTemplate}
            handleTemplateSelect={handleTemplateSelect}
            defaultSources={defaultSources}
          />
        );
      case "edit-render":
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
      case "finished":
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
    <div className="mx-auto w-full max-w-[23rem] space-y-8 p-4 sm:max-w-5xl md:max-w-7xl">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 text-lg font-bold md:text-3xl"
      >
        {step && steps.indexOf(step as string) !== -1
          ? steps[steps.indexOf(step as string)]
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          : "Create Your Video"}
      </motion.h1>
      <Stepper
        steps={steps.map((s) =>
          s
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
        )}
        currentStep={steps.indexOf(step as string) + 1}
        onStepClick={(index) => handleStepChange(index)}
        isLoading={isRendering}
        loadingStep={isRendering ? 4 : 0}
        loadingMessage={isRendering ? "Rendering..." : ""}
        isFinished={step === "finished"}
        isError={
          !!error ||
          (userCreditInfo &&
            userCreditInfo.used_credits >= userCreditInfo.total_credits)
        }
      />
      <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>

      {error && (
        <AlertDialog open={!!error}>
          <AlertDialogContent>
            <AlertDialogDescription>{error}</AlertDialogDescription>
            <AlertDialogAction onClick={() => setError(null)}>
              OK
            </AlertDialogAction>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default Create;
