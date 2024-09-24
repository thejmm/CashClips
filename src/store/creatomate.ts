// src/store/creatomate.ts
import { Preview, PreviewState } from "@creatomate/preview";
import { makeAutoObservable, runInAction } from "mobx";

import { CloudinaryVideo } from "@/types/cloudinary"; // Updated import
import { DefaultSource } from "@/utils/creatomate/templates";
import { FontStyle } from "@/utils/creatomate/font-types";
import { v4 as uuid } from "uuid";

class VideoCreatorStore {
  preview?: Preview = undefined;
  state?: PreviewState = undefined;
  selectedSource: DefaultSource | null = null;
  userId: string | null = null;
  isPlaying = false;
  time = 0;
  totalDuration = 0;
  queuedVideoUpdates: { elementId: string; source: string }[] = [];
  queuedCaptions: { elementId: string; captions: any; fontStyle: FontStyle }[] =
    [];

  constructor() {
    makeAutoObservable(this);
  }

  setUserId(id: string) {
    this.userId = id;
  }

  async initializeVideoPlayer(htmlElement: HTMLDivElement) {
    if (this.preview) {
      this.preview.dispose();
      this.preview = undefined;
    }

    const preview = new Preview(
      htmlElement,
      "interactive",
      process.env.NEXT_PUBLIC_CREATOMATE_PUBLIC_TOKEN!,
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
          this.totalDuration = state.duration;
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
      (el: any) => el.id === elementId,
    );
    if (elementToUpdate) {
      elementToUpdate.source = newSource;
      await this.preview.setSource(source, true);
    }
  }

  async updateTemplateWithSelectedVideo(
    selectedVideo: CloudinaryVideo, // Updated type
    availableVideos: CloudinaryVideo[], // Updated type
  ): Promise<void> {
    if (!this.preview || !this.selectedSource) return;

    const source = this.preview.getSource();
    const selectedVideoUrl = selectedVideo.url; // Use the URL directly
    const selectedVideoDuration = selectedVideo.duration;

    console.log("Updating template with selected video:", selectedVideoUrl);

    const videoElements = source.elements.filter(
      (el: any) => el.type === "video",
    );

    switch (this.selectedSource.type) {
      case "portrait-split":
        await this.updateVideoElement(videoElements[0], selectedVideo);
        break;
      case "landscape-split":
        await this.updateVideoElement(videoElements[0], selectedVideo);
        break;
      case "blur-vertical":
      case "blur-horizontal":
      case "picture-in-picture":
        // Update all video elements for these templates
        for (const element of videoElements) {
          await this.updateVideoElement(element, selectedVideo);
        }
        break;
      case "square":
        await this.updateVideoElement(videoElements[0], selectedVideo);
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
      JSON.stringify(source.elements, null, 2),
    );

    await this.preview.setSource(source, true);

    runInAction(() => {
      this.totalDuration = selectedVideoDuration;
    });
  }

  private async updateVideoElement(element: any, video: CloudinaryVideo) {
    element.source = video.url;
    element.duration = video.duration;
  }

  async addCaptionsAsElements(
    elementId: string,
    captions: any,
    fontStyle: FontStyle,
  ): Promise<void> {
    if (!this.preview || !captions) return;

    const source = this.preview.getSource();
    const elements = this.preview.state!.elements;
    const track = Math.max(...elements.map((e) => e.track), 0) + 1;

    for (const word of captions.words) {
      const id = uuid();
      source.elements.push({
        id,
        type: "text",
        text: word.word,
        start: word.start,
        duration: word.end - word.start,
        track,
        ...fontStyle.styles,
      });
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
      },
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
        return "unknown";
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
    frameRate: number = 30,
  ): Promise<string> {
    if (!this.preview || !this.userId) {
      throw new Error("Preview is not initialized or user ID is not set");
    }

    const source = this.preview.getSource();

    const renderJob = {
      outputFormat,
      frameRate,
      modifications,
      source,
      user_id: this.userId,
    };

    const response = await fetch(
      "https://thejmm--render-cash-clips-fastapi-app.modal.run/api/creatomate/videos",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([renderJob]),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (result.job_ids && result.job_ids.length > 0) {
      return result.job_ids[0];
    } else {
      throw new Error("No job IDs returned from the server");
    }
  }

  async checkRenderStatus(jobId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const pollInterval = setInterval(async () => {
        try {
          const response = await fetch(
            `https://thejmm--render-cash-clips-fastapi-app.modal.run/api/creatomate/fetch-render-status?id=${jobId}`,
            { method: "GET", headers: { "Content-Type": "application/json" } },
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const jobStatus = await response.json();
          console.log("Status response:", jobStatus); // Log the entire response

          if (!jobStatus || typeof jobStatus !== "object") {
            throw new Error("Invalid response format");
          }

          console.log(`Current status for job ${jobId}:`, jobStatus.status);

          if (jobStatus.status === "succeeded") {
            clearInterval(pollInterval);
            resolve(jobStatus);
          } else if (jobStatus.status === "failed") {
            clearInterval(pollInterval);
            reject(
              new Error(
                `Job ${jobId} failed: ${jobStatus.error || "Unknown error"}`,
              ),
            );
          } else if (
            !["rendering", "planned", "waiting", "transcribing"].includes(
              jobStatus.status,
            )
          ) {
            clearInterval(pollInterval);
            reject(new Error(`Unknown job status: ${jobStatus.status}`));
          }
          // If status is still rendering, planned, waiting, or transcribing, continue polling
        } catch (error) {
          console.error("Error in checkRenderStatus:", error);
          clearInterval(pollInterval);
          reject(error);
        }
      }, 5000); // Poll every 5 seconds

      // Set a timeout to stop polling after 10 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
        reject(new Error("Render status check timed out after 10 minutes"));
      }, 600000);
    });
  }
}

export const videoCreator = new VideoCreatorStore();
