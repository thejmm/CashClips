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
  }

  initializeVideoPlayer(htmlElement: HTMLDivElement) {
    return new Promise<void>((resolve) => {
      if (this.preview) {
        this.preview.dispose();
        this.preview = undefined;
      }
      if (!htmlElement) {
        console.error("HTMLElement is null or undefined");
        throw new Error("Invalid HTML element for video player");
      }

      const preview = new Preview(
        htmlElement,
        "interactive",
        process.env.NEXT_PUBLIC_CREATOMATE_PUBLIC_TOKEN!,
      );

      this.preview = preview;

      preview.onReady = async () => {
        console.log("Preview is ready");
        await preview.setZoom("centered");
        resolve();
      };

      preview.onLoad = async () => {
        runInAction(() => (this.isLoading = true));
      };

      preview.onLoadComplete = async () => {
        runInAction(() => (this.isLoading = false));
      };

      preview.onPlay = () => {
        runInAction(() => (this.isPlaying = true));
      };

      preview.onPause = () => {
        runInAction(() => (this.isPlaying = false));
      };

      preview.onTimeChange = (time) => {
        if (!this.isScrubbing) {
          runInAction(() => (this.time = time));
        }
      };

      preview.onActiveCompositionChange = (elementId) => {
        runInAction(() => (this.activeCompositionId = elementId ?? undefined));
        this.updateTracks();
      };

      preview.onActiveElementsChange = (elementIds) => {
        runInAction(() => (this.activeElementIds = elementIds));
      };

      preview.onStateChange = (state) => {
        runInAction(() => (this.state = state));
        this.updateTracks();
      };
    });
  }

  async skipForward(hold: boolean = false): Promise<void> {
    if (this.preview?.setTime && this.preview?.onTimeChange) {
      const currentTime = this.time;
      const skipAmount = hold ? 0.1 : 1;
      const newTime = Math.min(currentTime + skipAmount, this.duration);
      await this.setTime(newTime);
      this.preview.onTimeChange(newTime);
    }
  }

  async skipBackward(hold: boolean = false): Promise<void> {
    if (this.preview?.setTime && this.preview?.onTimeChange) {
      const currentTime = this.time;
      const skipAmount = hold ? 0.1 : 1;
      const newTime = Math.max(currentTime - skipAmount, 0);
      await this.setTime(newTime);
      this.preview.onTimeChange(newTime);
    }
  }

  async setTool(
    tool: "default" | "pen" | "text" | "ellipse" | "rectangle",
  ): Promise<void> {
    await this.preview?.setTool(tool);
  }

  async setFontStyle(elementId: string, style: FontStyle): Promise<void> {
    const preview = this.preview;
    if (!preview) return;

    const element = preview.findElement((el) => el.source.id === elementId);
    if (element) {
      await preview.applyModifications({
        [`${elementId}.fontStyle`]: style,
      });
    }
  }

  async setVolume(elementId: string, volume: number): Promise<void> {
    const preview = this.preview;
    if (!preview) return;

    const element = preview.findElement((el) => el.source.id === elementId);
    if (element) {
      element.source.volume = volume;
      await preview.applyModifications({
        [`${elementId}.volume`]: volume,
      });
    }
  }

  async setTime(time: number): Promise<void> {
    this.time = time;
    await this.preview?.setTime(time);
  }

  async setActiveElements(...elementIds: string[]): Promise<void> {
    this.activeElementIds = elementIds;
    await this.preview?.setActiveElements(elementIds);
  }

  getActiveElement(): ElementState | undefined {
    const preview = this.preview;
    if (!preview || this.activeElementIds.length === 0) {
      return undefined;
    }

    const id = videoCreator.activeElementIds[0];
    return preview.findElement((element) => element.source.id === id);
  }

  getActiveComposition(): CompositionState | PreviewState | undefined {
    const preview = this.preview;
    if (!preview) {
      return undefined;
    } else if (this.activeCompositionId) {
      // Find the active composition by its ID
      return preview.findElement(
        (element) => element.source.id === this.activeCompositionId,
      );
    } else {
      return preview.state;
    }
  }

  getActiveCompositionElements(): ElementState[] {
    return this.getActiveComposition()?.elements ?? [];
  }

  getActiveCompositionSource(): Record<string, any> {
    const preview = this.preview;
    if (!preview || !preview.state) {
      return [];
    }

    if (this.activeCompositionId) {
      // Find the active composition based on its ID
      const activeComposition = preview.findElement(
        (element) => element.source.id === this.activeCompositionId,
        preview.state,
      );
      // Get the composition's source
      return preview.getSource(activeComposition);
    } else {
      return preview.getSource(preview.state);
    }
  }

  async setActiveCompositionSource(source: Record<string, any>): Promise<void> {
    const activeCompositionId = this.activeCompositionId;
    if (activeCompositionId) {
      const preview = this.preview;
      if (preview) {
        // Make a copy of the source before making changes
        const fullSource = deepClone(preview.getSource());

        // Find the active composition's source
        const activeComposition = deepFind(
          (element) => element.id === activeCompositionId,
          fullSource,
        );
        if (activeComposition) {
          // Update the source in-place
          Object.keys(activeComposition).forEach(
            (key) => delete activeComposition[key],
          );
          Object.assign(activeComposition, source);
        }

        // Apply the source
        await preview.setSource(fullSource, true);
      }
    } else {
      await this.preview?.setSource(source, true);
    }
  }

  async createElement(elementSource: Record<string, any>): Promise<void> {
    const preview = this.preview;
    if (!preview || !preview.state) {
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
  }

  async deleteElement(elementId: string): Promise<void> {
    const preview = this.preview;
    if (!preview || !preview.state) {
      return;
    }

    const source = deepClone(this.getActiveCompositionSource());
    source.elements = source.elements.filter(
      (element: Record<string, any>) => element.id !== elementId,
    );

    await this.setActiveCompositionSource(source);
  }

  async rearrangeTracks(
    track: number,
    direction: "up" | "down",
  ): Promise<void> {
    const preview = this.preview;
    if (!preview || !preview.state) {
      return;
    }

    const targetTrack = direction === "up" ? track + 1 : track - 1;
    if (targetTrack < 1) {
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
  }

  async fetchCaptions(url: string, elementId: string): Promise<void> {
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
    }
  }

  async setSelectedSource(source: DefaultSource): Promise<void> {
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
    return this.selectedSource?.type === "blur";
  }

  isSplitTemplate(): boolean {
    return this.selectedSource?.type === "split";
  }

  isPictureInPictureTemplate(): boolean {
    return this.selectedSource?.type === "picture-in-picture";
  }

  async updateVideoSource(elementId: string, newSource: string): Promise<void> {
    const source = deepClone(this.getActiveCompositionSource());
    if (this.isBlurTemplate() || this.isPictureInPictureTemplate()) {
      source.elements.forEach((element: any) => {
        if (element.type === "video") {
          element.source = newSource;
        }
      });
    } else {
      const elementIndex = source.elements.findIndex(
        (el: any) => el.id === elementId,
      );
      if (elementIndex !== -1) {
        source.elements[elementIndex].source = newSource;
      }
    }
    await this.setActiveCompositionSource(source);
  }

  async finishVideo(
    modifications: any = {},
    outputFormat: string = "mp4",
    frameRate: number = 30,
  ): Promise<any> {
    const preview = this.preview;
    if (!preview) {
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.job_ids && result.job_ids.length > 0) {
        return await this.pollJobStatus(result.job_ids);
      } else {
        throw new Error("No job IDs returned from the server");
      }
    } catch (error) {
      console.error("Render error:", error);
      throw error;
    }
  }

  private async pollJobStatus(jobIds: string[]): Promise<any> {
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
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const statuses = await response.json();
          const allCompleted = Object.values(statuses).every(
            (status: any) =>
              status.status === "succeeded" || status.status === "failed",
          );

          if (allCompleted) {
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
    this.tracks = groupBy(
      this.getActiveCompositionElements(),
      (element) => element.track,
    );
  }
}

export const videoCreator = new VideoCreatorStore();
