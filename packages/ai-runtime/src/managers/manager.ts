import type { LanguageModelTier } from "@/config/definitions";

export type DownloadProgress = {
  bytesDownloaded: number;
  bytesTotal: number;
  progress: number;
};

export type DownloadCallbacks = {
  onProgress: (progress: DownloadProgress) => void;
};

export interface LanguageModelManager {
  downloadModel(
    tier: LanguageModelTier,
    callbacks: DownloadCallbacks,
  ): Promise<void>;
  warmModel(tier: LanguageModelTier): Promise<void>;
  listCachedModels(): Promise<LanguageModelTier[]>;
}
