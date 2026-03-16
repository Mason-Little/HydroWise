import type { EmbeddingModel } from "ai";
import { createWebEmbeddingModel } from "@/adapters/web/embedding";

const webEmbeddingState: {
  activeEmbeddingModel: EmbeddingModel | undefined;
} = {
  activeEmbeddingModel: undefined,
};

// Builds the web embedding model.
export const initWebEmbeddingManager = () => {
  webEmbeddingState.activeEmbeddingModel = createWebEmbeddingModel();
};

// Returns the currently active web embedding model or throws.
export const getWebEmbeddingModel = () => {
  if (!webEmbeddingState.activeEmbeddingModel) {
    throw new Error("Web embedding model not initialized.");
  }

  return webEmbeddingState.activeEmbeddingModel;
};
