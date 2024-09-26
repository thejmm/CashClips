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

  // Fetch user credits once the user is available
  useEffect(() => {
    if (user) {
      videoCreator.setUserId(user.id);
      fetchUserCreditInfo();
    }
  }, [user]);

  // Use router.replace instead of push to prevent unnecessary history updates
  useEffect(() => {
    if (!step || !steps.includes(step as string)) {
      router.replace({ query: { step: steps[0] } });
      return;
    }

    const stepIndex = steps.indexOf(step as string);

    if (stepIndex >= 1 && !selectedStreamer) {
      router.replace({ query: { step: steps[0] } });
      return;
    }

    if (stepIndex >= 2 && !selectedVideo) {
      router.replace({ query: { step: steps[1] } });
      return;
    }

    if (stepIndex >= 3 && !selectedTemplate) {
      router.replace({ query: { step: steps[2] } });
      return;
    }
  }, [step, selectedStreamer, selectedVideo, selectedTemplate, router]);

  // Fetch user credit info from Supabase
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
    router.replace({ query: { step: steps[0] } });
    setSelectedStreamer(null);
    setSelectedVideo(null);
    setAvailableVideos([]);
    setSelectedTemplate(null);
    setIsCaptionsGenerated(false);
    setRenderResult(null);
    setError(null);
    fetchUserCreditInfo();
  };

  const handleStepChange = (stepIndex: number) => {
    router.replace({ query: { step: steps[stepIndex] } });
  };

  const handleExport = async () => {
    setIsRendering(true);
    setError(null);
    try {
      const jobId = await videoCreator.finishVideo();
      const result = await videoCreator.checkRenderStatus(jobId);
      setRenderResult(result);
      router.replace({ query: { step: steps[4] } }); // Move to the finished step
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
    router.replace({ query: { step: steps[2] } }); // Move to template step
  };

  const handleTemplateSelect = (template: DefaultSource) => {
    setSelectedTemplate(template);
    router.replace({ query: { step: steps[3] } }); // Move to edit-render step
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
              router.replace({ query: { step: steps[1] } });
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
