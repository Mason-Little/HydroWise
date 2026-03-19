import type { LanguageModelTier } from "@/config/definitions";
import type { DownloadCallbacks } from "@/managers/types";

export type { DownloadCallbacks, DownloadProgress } from "@/managers/types";

export interface LanguageModelManager {
  downloadModel(
    tier: LanguageModelTier,
    callbacks: DownloadCallbacks,
  ): Promise<void>;
  warmModel(tier: LanguageModelTier): Promise<void>;
  coolModel(tier: LanguageModelTier): Promise<void>;
  isDefaultModelCached(): Promise<boolean>;
  listCachedModels(): Promise<LanguageModelTier[]>;
}
