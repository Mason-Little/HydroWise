import type { EmbeddingModelV3 } from "@ai-sdk/provider";
import { createDesktopEmbeddingAdapter } from "@/adapters/desktop/embedding";
import {
  downloadDesktopEmbeddingModel,
  isDesktopEmbeddingModelCached,
  warmDesktopEmbeddingModel,
} from "@/backends/desktop/embedding-service";
import { ensureDesktopServerReady } from "@/backends/desktop/service";
import type { EmbeddingModelManager } from "./manager";

const desktopEmbeddingState: { activeModel: EmbeddingModelV3 | undefined } = {
  activeModel: undefined,
};

// Builds the EmbeddingModelManager implementation for desktop.
export const createDesktopEmbeddingManager = (): EmbeddingModelManager => ({
  downloadModel: async (callbacks) => {
    await downloadDesktopEmbeddingModel({ onProgress: callbacks.onProgress });
  },
  isModelCached: async () => {
    return isDesktopEmbeddingModelCached();
  },
  warmModel: async () => {
    const modelId = await warmDesktopEmbeddingModel();
    desktopEmbeddingState.activeModel = createDesktopEmbeddingAdapter(modelId);
  },
});

// Kicks off desktop server readiness in the background.
export const initDesktopEmbeddingManager = () => {
  void ensureDesktopServerReady();
};

// Returns the currently loaded desktop embedding model or throws.
export const getDesktopEmbeddingModel = (): EmbeddingModelV3 => {
  if (!desktopEmbeddingState.activeModel) {
    throw new Error("Embedding model not loaded.");
  }
  return desktopEmbeddingState.activeModel;
};
