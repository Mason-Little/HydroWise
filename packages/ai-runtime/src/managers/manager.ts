import type { LanguageModelTier } from "@/config/definitions";

export type DownloadProgress = {
  bytesDownloaded: number;
  bytesTotal: number;
  progress: number;
};

export type DownloadCallbacks = {
  onProgress: (progress: DownloadProgress) => void;
  onWarmed: () => void;
};

export type WarmCallbacks = {
  onWarmed: () => void;
};

export interface LanguageModelManager {
  downloadModel(
    tier: LanguageModelTier,
    callbacks: DownloadCallbacks,
  ): Promise<void>;
  warmModel(tier: LanguageModelTier, callbacks: WarmCallbacks): Promise<void>;
  listCachedModels(): Promise<LanguageModelTier[]>;
}
