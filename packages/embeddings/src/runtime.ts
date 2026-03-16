import type { EmbeddingModel } from "ai";
import {
  getDesktopEmbeddingModel,
  initDesktopEmbeddingManager,
} from "@/managers/desktop";
import { getWebEmbeddingModel, initWebEmbeddingManager } from "@/managers/web";

export type EmbeddingsRuntime = "web" | "desktop";

export const runtimeState: {
  currentRuntime: EmbeddingsRuntime;
} = {
  currentRuntime: "web",
};

// Sets the runtime and initializes the matching embedding model manager.
export const initEmbeddingsRuntime = (runtime: EmbeddingsRuntime): void => {
  runtimeState.currentRuntime = runtime;
  switch (runtime) {
    case "desktop":
      initDesktopEmbeddingManager();
      break;
    case "web":
      initWebEmbeddingManager();
      break;
  }
};

// Returns the embedding model for the current runtime.
export const getEmbeddingModel = (): EmbeddingModel => {
  switch (runtimeState.currentRuntime) {
    case "desktop":
      return getDesktopEmbeddingModel();
    case "web":
      return getWebEmbeddingModel();
  }
};

export const getRuntime = (): EmbeddingsRuntime => {
  return runtimeState.currentRuntime;
};
