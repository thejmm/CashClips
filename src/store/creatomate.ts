// src/store/creatomate.ts
import { Preview, PreviewState } from "@creatomate/preview";
import { makeAutoObservable, runInAction } from "mobx";

import { CloudinaryVideo } from "@/types/cloudinary";
import { DefaultSource } from "@/utils/creatomate/templates";
import { FontStyle } from "@/utils/creatomate/font-types";
import { createClient } from "@/utils/supabase/component";
import { v4 as uuid } from "uuid";

const PLAN_LIMITS = {
  Starter: { max_duration: 30, frame_rate: 30 },
  Pro: { max_duration: 60, frame_rate: 30 },
  Ultimate: { max_duration: 60, frame_rate: 60 },
  Agency: { max_duration: 60, frame_rate: 60 },
};

const supabase = createClient();

class VideoCreatorStore {
  preview?: Preview = undefined;
  state?: PreviewState = undefined;
  selectedSource: DefaultSource | null = null;
  userId: string | null = null;
  userPlan: string | null = null;
  usedCredits: number = 0;
  totalCredits: number = 0;
  isPlaying = false;
  time = 0;
  totalDuration = 0;
  queuedVideoUpdates: { elementId: string; source: string }[] = [];
  queuedCaptions: { elementId: string; captions: any; fontStyle: FontStyle }[] =
    [];

  constructor() {
    makeAutoObservable(this);
  }

  async setUserId(id: string) {
    this.userId = id;
    await this.fetchUserData();
  }

  async fetchUserData() {
    if (!this.userId) {
      console.error("User ID not set");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("user_data")
        .select("plan_name, used_credits, total_credits")
        .eq("user_id", this.userId)
        .single();

      if (error) throw error;

      runInAction(() => {
        this.userPlan = data.plan_name;
        this.usedCredits = data.used_credits;
        this.totalCredits = data.total_credits;
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  async initializeVideoPlayer(htmlElement: HTMLDivElement) {
    if (this.preview) {
      this.preview.dispose();
      this.preview = undefined;
    }
    const preview = new Preview(
      htmlElement,
      "interactive",
      process.env.NEXT_PUBLIC_CREATOMATE_PUBLIC_TOKEN!
    );
    this.preview = preview;
    return new Promise<void>((resolve, reject) => {
      preview.onReady = async () => {
        try {
          await preview.setZoom("centered");
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      preview.onPlay = () => runInAction(() => (this.isPlaying = true));
      preview.onPause = () => runInAction(() => (this.isPlaying = false));
      preview.onTimeChange = (time) => runInAction(() => (this.time = time));
      preview.onStateChange = (state) => {
        runInAction(() => {
          this.state = state;
          this.totalDuration = this.getMaxAllowedDuration(state.duration);
        });
      };
    });
  }

  async setSelectedSource(source: DefaultSource): Promise<void> {
    console.log("Setting selected source:", source);
    this.selectedSource = source;
    if (this.preview) {
      await this.preview.setSource(source.data);
    }
  }

  queueVideoUpdate(elementId: string, source: string) {
    this.queuedVideoUpdates.push({ elementId, source });
  }

  queueCaptionsUpdate(elementId: string, captions: any, fontStyle: FontStyle) {
    this.queuedCaptions.push({ elementId, captions, fontStyle });
  }

  async applyQueuedUpdates() {
    if (!this.preview) return;

    for (const { elementId, source } of this.queuedVideoUpdates) {
      await this.updateVideoSource(elementId, source);
    }
    this.queuedVideoUpdates = [];

    for (const { elementId, captions, fontStyle } of this.queuedCaptions) {
      await this.addCaptionsAsElements(elementId, captions, fontStyle);
    }
    this.queuedCaptions = [];
  }

  async updateVideoSource(elementId: string, newSource: string): Promise<void> {
    if (!this.preview) return;

    const source = this.preview.getSource();
    const elementToUpdate = source.elements.find(
      (el: any) => el.id === elementId
    );
    if (elementToUpdate) {
      elementToUpdate.source = newSource;
      await this.preview.setSource(source, true);
    }
  }

  async updateTemplateWithSelectedVideo(
    selectedVideo: CloudinaryVideo
  ): Promise<void> {
    if (!this.preview || !this.selectedSource) return;

    const source = this.preview.getSource();
    const selectedVideoUrl = selectedVideo.url;
    const selectedVideoDuration = this.getMaxAllowedDuration(
      selectedVideo.duration
    );

    console.log("Updating template with selected video:", selectedVideoUrl);

    const videoElements = source.elements.filter(
      (el: any) => el.type === "video"
    );

    switch (this.selectedSource.type) {
      case "portrait-split":
      case "landscape-split":
      case "square":
        await this.updateVideoElement(videoElements[0], selectedVideo);
        break;
      case "blur-vertical":
      case "blur-horizontal":
      case "picture-in-picture":
        for (const element of videoElements) {
          await this.updateVideoElement(element, selectedVideo);
        }
        break;
      default:
        console.warn("Unknown template type:", this.selectedSource.type);
        for (const element of videoElements) {
          await this.updateVideoElement(element, selectedVideo);
        }
    }

    source.duration = selectedVideoDuration;

    console.log(
      "Source elements after update:",
      JSON.stringify(source.elements, null, 2)
    );

    await this.preview.setSource(source, true);

    runInAction(() => {
      this.totalDuration = selectedVideoDuration;
    });
  }

  private async updateVideoElement(element: any, video: CloudinaryVideo) {
    element.source = video.url;
    element.duration = this.getMaxAllowedDuration(video.duration);
  }

  private getMaxAllowedDuration(duration: number): number {
    if (!this.userPlan) {
      console.warn("User plan not set, using default duration");
      return duration;
    }
    const planLimits = PLAN_LIMITS[this.userPlan as keyof typeof PLAN_LIMITS];
    return Math.min(duration, planLimits.max_duration);
  }

  async addCaptionsAsElements(
    elementId: string,
    captions: any,
    fontStyle: FontStyle
  ): Promise<void> {
    if (!this.preview || !captions) return;

    const source = this.preview.getSource();
    const elements = this.preview.state!.elements;
    const track = Math.max(...elements.map((e) => e.track), 0) + 1;

    const maxDuration = this.getMaxAllowedDuration(this.totalDuration);
    for (const word of captions.words) {
      if (word.start < maxDuration) {
        const id = uuid();
        source.elements.push({
          id,
          type: "text",
          text: word.word,
          start: word.start,
          duration: Math.min(word.end, maxDuration) - word.start,
          track,
          ...fontStyle.styles,
        });
      }
    }

    await this.preview.setSource(source, true);
  }

  async fetchCaptions(url: string, elementId: string): Promise<any> {
    const response = await fetch(
      "https://thejmm--captions-cash-clips-fastapi-app.modal.run/transcribe",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch captions");
    }

    const data = await response.json();
    if (data.status === "success") {
      return data.transcription;
    } else {
      throw new Error(data.message || "Unknown error");
    }
  }

  isBlurTemplate(): boolean {
    return (
      this.selectedSource?.type === "blur-vertical" ||
      this.selectedSource?.type === "blur-horizontal"
    );
  }

  isSplitTemplate(): boolean {
    return (
      this.selectedSource?.type === "portrait-split" ||
      this.selectedSource?.type === "landscape-split"
    );
  }

  isPictureInPictureTemplate(): boolean {
    return this.selectedSource?.type === "picture-in-picture";
  }

  isSquareTemplate(): boolean {
    return this.selectedSource?.type === "square";
  }

  getTemplateOrientation(): "portrait" | "landscape" | "square" | "unknown" {
    if (!this.selectedSource) return "unknown";

    switch (this.selectedSource.type) {
      case "portrait-split":
      case "blur-vertical":
        return "portrait";
      case "landscape-split":
      case "blur-horizontal":
        return "landscape";
      case "square":
        return "square";
      case "picture-in-picture":
      default:
        return "unknown";
    }
  }

  async skipForward(hold: boolean = false): Promise<void> {
    if (!this.preview) return;
    const skipAmount = hold ? 0.1 : 1;
    const newTime = Math.min(this.time + skipAmount, this.totalDuration);
    await this.preview.setTime(newTime);
  }

  async skipBackward(hold: boolean = false): Promise<void> {
    if (!this.preview) return;
    const skipAmount = hold ? 0.1 : 1;
    const newTime = Math.max(this.time - skipAmount, 0);
    await this.preview.setTime(newTime);
  }

  async finishVideo(
    modifications: any = {},
    outputFormat: string = "mp4",
    frameRate: number = 30
  ): Promise<string> {
    if (!this.preview || !this.userId) {
      throw new Error("Preview is not initialized or user ID is not set");
    }

    if (!this.userPlan) {
      await this.fetchUserData();
      if (!this.userPlan) {
        throw new Error("Unable to fetch user plan");
      }
    }

    if (this.usedCredits >= this.totalCredits) {
      throw new Error("Insufficient credits to render video");
    }

    const source = this.preview.getSource();
    const planLimits = PLAN_LIMITS[this.userPlan as keyof typeof PLAN_LIMITS];

    // Trim the video to the maximum allowed duration
    source.duration = Math.min(source.duration, planLimits.max_duration);

    const renderJob = {
      outputFormat,
      frameRate: Math.min(frameRate, planLimits.frame_rate),
      modifications: {
        ...modifications,
      },
      source,
      user_id: this.userId,
    };

    try {
      const response = await fetch(
        "https://thejmm--render-cash-clips-fastapi-app.modal.run/api/creatomate/videos",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([renderJob]),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.job_ids && result.job_ids.length > 0) {
        const jobId = result.job_ids[0];
        await this.trackCreatedClip(jobId, renderJob);
        await this.updateUserCredits();
        return jobId;
      } else {
        throw new Error("No job IDs returned from the server");
      }
    } catch (error) {
      console.error("Error in finishVideo:", error);
      throw error;
    }
  }

  async trackCreatedClip(renderId: string, payload: any) {
    try {
      const { error } = await supabase.from("created_clips").insert({
        render_id: renderId,
        user_id: this.userId,
        status: "pending",
        payload: payload,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error tracking created clip:", error);
    }
  }

  async updateUserCredits() {
    try {
      const { error } = await supabase
        .from("user_data")
        .update({ used_credits: this.usedCredits + 1 })
        .eq("user_id", this.userId);

      if (error) throw error;

      runInAction(() => {
        this.usedCredits += 1;
      });
    } catch (error) {
      console.error("Error updating user credits:", error);
    }
  }

  async checkRenderStatus(jobId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const pollInterval = setInterval(async () => {
        try {
          const response = await fetch(
            `https://thejmm--render-cash-clips-fastapi-app.modal.run/api/creatomate/fetch-render-status?id=${jobId}`,
            { method: "GET", headers: { "Content-Type": "application/json" } }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const jobStatus = await response.json();
          console.log("Status response:", jobStatus);

          if (!jobStatus || typeof jobStatus !== "object") {
            throw new Error("Invalid response format");
          }

          console.log(`Current status for job ${jobId}:`, jobStatus.status);

          if (jobStatus.status === "succeeded") {
            clearInterval(pollInterval);
            await this.updateCreatedClipStatus(jobId, "completed", jobStatus);
            resolve(jobStatus);
          } else if (jobStatus.status === "failed") {
            clearInterval(pollInterval);
            await this.updateCreatedClipStatus(jobId, "failed", jobStatus);
            reject(
              new Error(
                `Job ${jobId} failed: ${jobStatus.error || "Unknown error"}`
              )
            );
          } else if (
            !["rendering", "planned", "waiting", "transcribing"].includes(
              jobStatus.status
            )
          ) {
            clearInterval(pollInterval);
            await this.updateCreatedClipStatus(jobId, "error", jobStatus);
            reject(new Error(`Unknown job status: ${jobStatus.status}`));
          }
        } catch (error) {
          console.error("Error in checkRenderStatus:", error);
          clearInterval(pollInterval);
          await this.updateCreatedClipStatus(jobId, "error", {
            error: (error as Error).message,
          });
          reject(error);
        }
      }, 5000);

      setTimeout(() => {
        clearInterval(pollInterval);
        this.updateCreatedClipStatus(jobId, "timeout");
        reject(new Error("Render status check timed out after 10 minutes"));
      }, 600000);
    });
  }

  async updateCreatedClipStatus(
    jobId: string,
    status: string,
    response: any = {}
  ) {
    try {
      const { error } = await supabase
        .from("created_clips")
        .update({ status, response })
        .eq("render_id", jobId);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating created clip status:", error);
    }
  }

  getQualityValue(quality: string): number {
    const qualityMap: { [key: string]: number } = {
      "720p": 720,
      "1080p": 1080,
    };
    return qualityMap[quality] || 0;
  }

  async getUserRenderedClips(): Promise<any[]> {
    if (!this.userId) {
      throw new Error("User ID not set");
    }

    try {
      const { data, error } = await supabase
        .from("created_clips")
        .select("*")
        .eq("user_id", this.userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error("Error fetching user rendered clips:", error);
      return [];
    }
  }

  async deleteRenderedClip(renderId: string): Promise<void> {
    if (!this.userId) {
      throw new Error("User ID not set");
    }

    try {
      const { error } = await supabase
        .from("created_clips")
        .delete()
        .eq("render_id", renderId)
        .eq("user_id", this.userId);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting rendered clip:", error);
      throw error;
    }
  }

  async updateUserProfile(
    updates: Partial<{
      plan_name: string;
      used_credits: number;
      total_credits: number;
    }>
  ): Promise<void> {
    if (!this.userId) {
      throw new Error("User ID not set");
    }

    try {
      const { error } = await supabase
        .from("user_data")
        .update(updates)
        .eq("user_id", this.userId);

      if (error) throw error;

      // Update local state
      runInAction(() => {
        if (updates.plan_name) this.userPlan = updates.plan_name;
        if (updates.used_credits !== undefined)
          this.usedCredits = updates.used_credits;
        if (updates.total_credits !== undefined)
          this.totalCredits = updates.total_credits;
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

  resetStore() {
    runInAction(() => {
      this.preview?.dispose();
      this.preview = undefined;
      this.state = undefined;
      this.selectedSource = null;
      this.userId = null;
      this.userPlan = null;
      this.usedCredits = 0;
      this.totalCredits = 0;
      this.isPlaying = false;
      this.time = 0;
      this.totalDuration = 0;
      this.queuedVideoUpdates = [];
      this.queuedCaptions = [];
    });
  }
}

export const videoCreator = new VideoCreatorStore();
