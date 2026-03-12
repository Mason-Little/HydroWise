import type { LanguageModelTier } from "@/config/definitions";

export type DownloadProgress = {
  bytesDownloaded: number;
  bytesTotal: number;
  progress: number;
};

export type DownloadCallbacks = {
  onProgress?: (progress: DownloadProgress) => void;
  onWarmed?: () => void;
  onError?: (error: unknown) => void;
};

export interface LanguageModelManager {
  downloadModel(
    tier: LanguageModelTier,
    callbacks?: DownloadCallbacks,
  ): Promise<void>;
  listCachedModels(): Promise<LanguageModelTier[]>;
}
