import type { EmbeddingModel } from "ai";
import {
  getDesktopEmbeddingModel,
  initDesktopEmbeddingModel,
} from "./desktop/init";

type ModelState = {
  activeModel?: EmbeddingModel;
};

const modelState: ModelState = {};

export const initEmbeddingModel = async (
  onProgress?: (progress: number) => void,
) => {
  if (import.meta.env.VITE_APP_MODE === "desktop") {
    await initDesktopEmbeddingModel(onProgress);
    modelState.activeModel = getDesktopEmbeddingModel();
  } else {
    throw new Error("Web embedding model is coming soon.");
  }
};

export const getEmbeddingModel = (): EmbeddingModel => {
  if (!modelState.activeModel) {
    throw new Error(
      "Embedding model has not been initialized. Call initEmbeddingModel first.",
    );
  }
  return modelState.activeModel;
};
