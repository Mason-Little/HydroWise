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
  const runtime = import.meta.env.VITE_RUNTIME ?? import.meta.env.VITE_APP_MODE;

  if (runtime === "desktop") {
    await initDesktopEmbeddingModel(onProgress);
    modelState.activeModel = getDesktopEmbeddingModel();
  } else {
    throw new Error("Web embedding model is coming soon.");
  }
};

export const getEmbeddingModel = async (): Promise<EmbeddingModel> => {
  if (!modelState.activeModel) {
    await initEmbeddingModel();
  }

  if (!modelState.activeModel) {
    throw new Error("Embedding Model Couldn't be initialized.");
  }

  return modelState.activeModel;
};
