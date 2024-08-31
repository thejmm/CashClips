// src/store/creatomate.ts
import {
  CompositionState,
  ElementState,
  Preview,
  PreviewState,
} from "@creatomate/preview";
import { DefaultSource, defaultSources } from "@/utils/creatomate/templates";
import { deepClone, deepFind, groupBy } from "@/utils/creatomate/utils";
import { makeAutoObservable, runInAction } from "mobx";

import { FontStyle } from "@/utils/creatomate/font-types";
import { v4 as uuid } from "uuid";

class VideoCreatorStore {
  preview?: Preview = undefined;
  state?: PreviewState = undefined;
  tracks?: Map<number, ElementState[]> = undefined;
  activeCompositionId: string | undefined = undefined;
  activeElementIds: string[] = [];
  isLoading = true;
  isPlaying = false;
  time = 0;
  timelineScale = 100;
  isScrubbing = false;
  tool: "default" | "pen" | "text" | "ellipse" | "rectangle" = "default";
  captions: { [key: string]: any } = {};
  volume: number = 100;
  selectedSource: DefaultSource | null = null;
  currentTime: number = 0;
  totalDuration: number = 0;

  constructor() {
    makeAutoObservable(this);
    console.log("VideoCreatorStore initialized");
  }

  initializeVideoPlayer(htmlElement: HTMLDivElement) {
    console.log("Initializing video player...");
    return new Promise<void>((resolve, reject) => {
      if (this.preview) {
        console.log("Disposing existing preview");
        this.preview.dispose();
        this.preview = undefined;
      }
      if (!htmlElement) {
        console.error("HTMLElement is null or undefined");
        reject(new Error("Invalid HTML element for video player"));
        return;
      }

      console.log("Creating new Preview instance");
      const preview = new Preview(
        htmlElement,
        "interactive",
        process.env.NEXT_PUBLIC_CREATOMATE_PUBLIC_TOKEN!,
      );

      this.preview = preview;

      preview.onReady = async () => {
        console.log("Preview is ready");
        try {
          await preview.setZoom("centered");
          console.log("Zoom set to centered");
          resolve();
        } catch (error) {
          console.error("Error setting zoom:", error);
          reject(error);
        }
      };

      preview.onLoad = async () => {
        console.log("Preview load started");
        runInAction(() => (this.isLoading = true));
      };

      preview.onLoadComplete = async () => {
        console.log("Preview load completed");
        runInAction(() => (this.isLoading = false));
      };

      preview.onPlay = () => {
        console.log("Preview started playing");
        runInAction(() => (this.isPlaying = true));
      };

      preview.onPause = () => {
        console.log("Preview paused");
        runInAction(() => (this.isPlaying = false));
      };

      preview.onTimeChange = (time) => {
        if (!this.isScrubbing) {
          console.log("Time changed:", time);
          runInAction(() => (this.time = time));
        }
      };

      preview.onActiveCompositionChange = (elementId) => {
        console.log("Active composition changed:", elementId);
        runInAction(() => (this.activeCompositionId = elementId ?? undefined));
        this.updateTracks();
      };

      preview.onActiveElementsChange = (elementIds) => {
        console.log("Active elements changed:", elementIds);
        runInAction(() => (this.activeElementIds = elementIds));
      };

      preview.onStateChange = (state) => {
        console.log("State changed");
        runInAction(() => (this.state = state));
        this.updateTracks();
      };

      console.log("Video player initialization complete");
    });
  }

  async skipForward(hold: boolean = false): Promise<void> {
    console.log("Skipping forward, hold:", hold);
    if (this.preview?.setTime && this.preview?.onTimeChange) {
      const currentTime = this.time;
      const skipAmount = hold ? 0.1 : 1;
      const newTime = Math.min(currentTime + skipAmount, this.duration);
      await this.setTime(newTime);
      this.preview.onTimeChange(newTime);
      console.log("Skipped forward to:", newTime);
    } else {
      console.warn("Cannot skip forward: preview or methods not available");
    }
  }

  async skipBackward(hold: boolean = false): Promise<void> {
    console.log("Skipping backward, hold:", hold);
    if (this.preview?.setTime && this.preview?.onTimeChange) {
      const currentTime = this.time;
      const skipAmount = hold ? 0.1 : 1;
      const newTime = Math.max(currentTime - skipAmount, 0);
      await this.setTime(newTime);
      this.preview.onTimeChange(newTime);
      console.log("Skipped backward to:", newTime);
    } else {
      console.warn("Cannot skip backward: preview or methods not available");
    }
  }

  async setTool(
    tool: "default" | "pen" | "text" | "ellipse" | "rectangle",
  ): Promise<void> {
    console.log("Setting tool:", tool);
    await this.preview?.setTool(tool);
  }

  async setFontStyle(elementId: string, style: FontStyle): Promise<void> {
    console.log("Setting font style for element:", elementId, style);
    const preview = this.preview;
    if (!preview) {
      console.warn("Cannot set font style: preview not available");
      return;
    }

    const element = preview.findElement((el) => el.source.id === elementId);
    if (element) {
      await preview.applyModifications({
        [`${elementId}.fontStyle`]: style,
      });
      console.log("Font style applied successfully");
    } else {
      console.warn("Element not found for font style change:", elementId);
    }
  }

  async setVolume(elementId: string, volume: number): Promise<void> {
    console.log("Setting volume for element:", elementId, volume);
    const preview = this.preview;
    if (!preview) {
      console.warn("Cannot set volume: preview not available");
      return;
    }

    const element = preview.findElement((el) => el.source.id === elementId);
    if (element) {
      element.source.volume = volume;
      await preview.applyModifications({
        [`${elementId}.volume`]: volume,
      });
      console.log("Volume applied successfully");
    } else {
      console.warn("Element not found for volume change:", elementId);
    }
  }

  async setTime(time: number): Promise<void> {
    console.log("Setting time:", time);
    this.time = time;
    await this.preview?.setTime(time);
  }

  async setActiveElements(...elementIds: string[]): Promise<void> {
    console.log("Setting active elements:", elementIds);
    this.activeElementIds = elementIds;
    await this.preview?.setActiveElements(elementIds);
  }

  getActiveElement(): ElementState | undefined {
    const preview = this.preview;
    if (!preview || this.activeElementIds.length === 0) {
      console.warn(
        "Cannot get active element: preview not available or no active elements",
      );
      return undefined;
    }

    const id = this.activeElementIds[0];
    const element = preview.findElement((element) => element.source.id === id);
    console.log("Active element:", element);
    return element;
  }

  getActiveComposition(): CompositionState | PreviewState | undefined {
    const preview = this.preview;
    if (!preview) {
      console.warn("Cannot get active composition: preview not available");
      return undefined;
    } else if (this.activeCompositionId) {
      const composition = preview.findElement(
        (element) => element.source.id === this.activeCompositionId,
      );
      console.log("Active composition:", composition);
      return composition;
    } else {
      console.log("Returning preview state as active composition");
      return preview.state;
    }
  }

  getActiveCompositionElements(): ElementState[] {
    const elements = this.getActiveComposition()?.elements ?? [];
    console.log("Active composition elements:", elements);
    return elements;
  }

  getActiveCompositionSource(): Record<string, any> {
    const preview = this.preview;
    if (!preview || !preview.state) {
      console.warn(
        "Cannot get active composition source: preview or state not available",
      );
      return {};
    }

    let source;
    if (this.activeCompositionId) {
      const activeComposition = preview.findElement(
        (element) => element.source.id === this.activeCompositionId,
        preview.state,
      );
      source = preview.getSource(activeComposition);
    } else {
      source = preview.getSource(preview.state);
    }
    console.log("Active composition source:", source);
    return source;
  }

  async setActiveCompositionSource(source: Record<string, any>): Promise<void> {
    console.log("Setting active composition source:", source);
    const activeCompositionId = this.activeCompositionId;
    if (activeCompositionId) {
      const preview = this.preview;
      if (preview) {
        const fullSource = deepClone(preview.getSource());
        const activeComposition = deepFind(
          (element) => element.id === activeCompositionId,
          fullSource,
        );
        if (activeComposition) {
          Object.keys(activeComposition).forEach(
            (key) => delete activeComposition[key],
          );
          Object.assign(activeComposition, source);
        }
        await preview.setSource(fullSource, true);
        console.log("Active composition source updated");
      } else {
        console.warn(
          "Cannot set active composition source: preview not available",
        );
      }
    } else {
      await this.preview?.setSource(source, true);
      console.log("Full source updated");
    }
  }

  async createElement(elementSource: Record<string, any>): Promise<void> {
    console.log("Creating new element:", elementSource);
    const preview = this.preview;
    if (!preview || !preview.state) {
      console.warn("Cannot create element: preview or state not available");
      return;
    }

    const elements = this.getActiveCompositionElements();
    const newTrackNumber =
      Math.max(...elements.map((element) => element.track)) + 1;
    const source = deepClone(this.getActiveCompositionSource());
    const id = uuid();

    source.elements.push({
      id,
      track: newTrackNumber,
      ...elementSource,
    });

    await this.setActiveCompositionSource(source);
    await this.setActiveElements(id);
    console.log("New element created with ID:", id);
  }

  async deleteElement(elementId: string): Promise<void> {
    console.log("Deleting element:", elementId);
    const preview = this.preview;
    if (!preview || !preview.state) {
      console.warn("Cannot delete element: preview or state not available");
      return;
    }

    const source = deepClone(this.getActiveCompositionSource());
    source.elements = source.elements.filter(
      (element: Record<string, any>) => element.id !== elementId,
    );

    await this.setActiveCompositionSource(source);
    console.log("Element deleted");
  }

  async rearrangeTracks(
    track: number,
    direction: "up" | "down",
  ): Promise<void> {
    console.log("Rearranging tracks:", track, direction);
    const preview = this.preview;
    if (!preview || !preview.state) {
      console.warn("Cannot rearrange tracks: preview or state not available");
      return;
    }

    const targetTrack = direction === "up" ? track + 1 : track - 1;
    if (targetTrack < 1) {
      console.warn("Cannot move track below 1");
      return;
    }

    const source = deepClone(this.getActiveCompositionSource());

    for (const element of this.getActiveCompositionElements()) {
      const elementSource = source.elements?.find(
        (elementSource: Record<string, any>) =>
          elementSource.id === element.source.id,
      );

      if (elementSource) {
        if (element.track === track) {
          elementSource.track = targetTrack;
        } else if (element.track === targetTrack) {
          elementSource.track = track;
        }
      }
    }

    await this.setActiveCompositionSource(source);
    console.log("Tracks rearranged");
  }

  async fetchCaptions(url: string, elementId: string): Promise<void> {
    console.log("Fetching captions for:", url, elementId);
    runInAction(() => (this.isLoading = true));
    try {
      const response = await fetch(
        "https://thejmm--whisper-transcription-fastapi-app.modal.run/transcribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch captions");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let result = "";
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader?.read()!;
        done = doneReading;
        result += decoder.decode(value, { stream: true });
      }

      const data = JSON.parse(result);
      if (data.status === "success") {
        runInAction(() => {
          this.captions[elementId] = data.transcription;
        });
        console.log("Captions fetched successfully");
      } else {
        throw new Error(data.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error fetching captions:", error);
      throw error;
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  async addCaptionsAsElements(
    elementId: string,
    selectedStyle: FontStyle,
  ): Promise<void> {
    console.log("Adding captions as elements for:", elementId);
    const captions = this.captions[elementId];
    if (captions) {
      const source = deepClone(this.getActiveCompositionSource());
      const elements = this.getActiveCompositionElements();
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
          ...selectedStyle.styles,
        });
      }

      await this.setActiveCompositionSource(source);
      await this.preview?.setSource(source, true);
      console.log("Captions added as elements");
    } else {
      console.warn("No captions found for element:", elementId);
    }
  }

  async setSelectedSource(source: DefaultSource): Promise<void> {
    console.log("Setting selected source:", source.name);
    this.selectedSource = source;
    if (this.preview) {
      try {
        await this.preview.setSource(source.data);
        console.log("Source set successfully");
      } catch (error) {
        console.error("Error setting source:", error);
        throw error;
      }
    } else {
      console.warn(
        "Preview not initialized, source will be set when preview is ready",
      );
    }
  }

  get duration(): number {
    return this.totalDuration;
  }

  get currentPlaybackTime(): number {
    return this.currentTime;
  }

  isBlurTemplate(): boolean {
    const isBlur = this.selectedSource?.type === "blur";
    console.log("Is blur template:", isBlur);
    return isBlur;
  }

  isSplitTemplate(): boolean {
    const isSplit = this.selectedSource?.type === "split";
    console.log("Is split template:", isSplit);
    return isSplit;
  }

  isPictureInPictureTemplate(): boolean {
    const isPiP = this.selectedSource?.type === "picture-in-picture";
    console.log("Is picture-in-picture template:", isPiP);
    return isPiP;
  }

  async updateVideoSource(elementId: string, newSource: string): Promise<void> {
    console.log(
      "Updating video source for element:",
      elementId,
      "New source:",
      newSource,
    );
    const source = deepClone(this.getActiveCompositionSource());
    if (this.isBlurTemplate() || this.isPictureInPictureTemplate()) {
      source.elements.forEach((element: any) => {
        if (element.type === "video") {
          element.source = newSource;
        }
      });
      console.log("Updated all video elements in blur/PiP template");
    } else {
      const elementIndex = source.elements.findIndex(
        (el: any) => el.id === elementId,
      );
      if (elementIndex !== -1) {
        source.elements[elementIndex].source = newSource;
        console.log("Updated specific video element");
      } else {
        console.warn("Element not found for video source update:", elementId);
      }
    }
    await this.setActiveCompositionSource(source);
  }

  async finishVideo(
    modifications: any = {},
    outputFormat: string = "mp4",
    frameRate: number = 30,
  ): Promise<any> {
    console.log(
      "Finishing video. Output format:",
      outputFormat,
      "Frame rate:",
      frameRate,
    );
    const preview = this.preview;
    if (!preview) {
      console.error("Preview is not initialized");
      throw new Error("Preview is not initialized");
    }

    try {
      const source = preview.getSource();
      const renderJob = {
        outputFormat,
        frameRate,
        modifications,
        source,
      };

      console.log("Sending render job to server");
      const response = await fetch(
        "https://thejmm--creatomate-render-fastapi-app.modal.run/api/creatomate/videos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([renderJob]),
        },
      );

      if (!response.ok) {
        console.error("Server response not OK:", response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Render job response:", result);
      if (result.job_ids && result.job_ids.length > 0) {
        return await this.pollJobStatus(result.job_ids);
      } else {
        console.error("No job IDs returned from the server");
        throw new Error("No job IDs returned from the server");
      }
    } catch (error) {
      console.error("Render error:", error);
      throw error;
    }
  }

  private async pollJobStatus(jobIds: string[]): Promise<any> {
    console.log("Polling job status for IDs:", jobIds);
    return new Promise((resolve, reject) => {
      const pollInterval = setInterval(async () => {
        try {
          const response = await fetch(
            `https://thejmm--creatomate-render-fastapi-app.modal.run/api/creatomate/fetch-render-status?${jobIds
              .map((id) => `id=${id}`)
              .join("&")}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          if (!response.ok) {
            console.error(
              "Error response when polling job status:",
              response.status,
            );
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const statuses = await response.json();
          console.log("Current job statuses:", statuses);
          const allCompleted = Object.values(statuses).every(
            (status: any) =>
              status.status === "succeeded" || status.status === "failed",
          );

          if (allCompleted) {
            console.log("All jobs completed");
            clearInterval(pollInterval);
            resolve(statuses);
          }
        } catch (error) {
          console.error("Error polling job status:", error);
          clearInterval(pollInterval);
          reject(error);
        }
      }, 1000); // Poll every 1 second
    });
  }

  private updateTracks(): void {
    console.log("Updating tracks");
    this.tracks = groupBy(
      this.getActiveCompositionElements(),
      (element) => element.track,
    );
    console.log("Updated tracks:", this.tracks);
  }
}

export const videoCreator = new VideoCreatorStore();
