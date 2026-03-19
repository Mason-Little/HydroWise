import type { DownloadCallbacks } from "@/managers/types";

export type { DownloadCallbacks } from "@/managers/types";

export interface EmbeddingModelManager {
  downloadModel(callbacks: DownloadCallbacks): Promise<void>;
  isModelCached(): Promise<boolean>;
  warmModel(): Promise<void>;
}
