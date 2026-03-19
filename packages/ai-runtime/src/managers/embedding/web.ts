import type { EmbeddingModelV3 } from "@ai-sdk/provider";
import { createWebEmbeddingAdapter } from "@/adapters/web/embedding";
import { initWebModelCache, isWebModelCached } from "@/backends/web/cache";
import {
  downloadWebEmbeddingModel,
  warmWebEmbeddingModel,
} from "@/backends/web/embedding-loader";
import { getEmbeddingModelDefinition } from "@/config/queries";
import type { EmbeddingModelManager } from "./manager";

const webEmbeddingState: { activeModel: EmbeddingModelV3 | undefined } = {
  activeModel: undefined,
};

// Builds the EmbeddingModelManager implementation for web.
export const createWebEmbeddingManager = (): EmbeddingModelManager => ({
  downloadModel: async (callbacks) => {
    await downloadWebEmbeddingModel(callbacks.onProgress);
  },
  isModelCached: async () => {
    const { web } = getEmbeddingModelDefinition();
    if (!web) {
      return false;
    }
    return isWebModelCached(web.modelId);
  },
  warmModel: async () => {
    const pipe = await warmWebEmbeddingModel();
    webEmbeddingState.activeModel = createWebEmbeddingAdapter(pipe);
  },
});

// Initializes the web embedding model cache.
export const initWebEmbeddingManager = () => {
  initWebModelCache();
};

// Returns the currently loaded web embedding model or throws.
export const getWebEmbeddingModel = (): EmbeddingModelV3 => {
  if (!webEmbeddingState.activeModel) {
    throw new Error("Embedding model not loaded.");
  }
  return webEmbeddingState.activeModel;
};
