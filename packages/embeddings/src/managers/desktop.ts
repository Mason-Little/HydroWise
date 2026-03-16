import type { EmbeddingModel } from "ai";
import { createDesktopEmbeddingModelAdapter } from "@/adapters/desktop/embedding";
import { ensureDesktopEmbeddingServerReady } from "@/backends/desktop/service";
import { DESKTOP_EMBEDDING_MODEL_ID } from "@/config/definitions";

const desktopEmbeddingState: {
  activeEmbeddingModel: EmbeddingModel | undefined;
} = {
  activeEmbeddingModel: undefined,
};

// Builds the embedding model adapter and kicks off server readiness in the background.
export const initDesktopEmbeddingManager = () => {
  desktopEmbeddingState.activeEmbeddingModel = createDesktopEmbeddingModelAdapter(
    DESKTOP_EMBEDDING_MODEL_ID,
  );
  void ensureDesktopEmbeddingServerReady();
};

// Returns the currently active desktop embedding model or throws.
export const getDesktopEmbeddingModel = () => {
  if (!desktopEmbeddingState.activeEmbeddingModel) {
    throw new Error("Desktop embedding model not initialized.");
  }

  return desktopEmbeddingState.activeEmbeddingModel;
};
