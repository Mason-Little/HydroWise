import type { DownloadCallbacks } from "@/managers/types";

export type { DownloadCallbacks } from "@/managers/types";

// The public interface for running vision/OCR inference.
// Not an AI SDK type — vision input is an image, not text.
export type VisionModel = {
  run(imageBase64: string): Promise<string>;
  dispose(): Promise<void>;
};

export interface VisionModelManager {
  downloadModel(callbacks: DownloadCallbacks): Promise<void>;
  isModelCached(): Promise<boolean>;
  warmModel(): Promise<void>;
  coolModel(): Promise<void>;
}
