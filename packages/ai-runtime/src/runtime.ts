import type { EmbeddingModelV3, LanguageModelV3 } from "@ai-sdk/provider";
import { initWebModelCache } from "@/backends/web/cache";
import {
  createDesktopEmbeddingManager,
  createWebEmbeddingManager,
  getDesktopEmbeddingModel,
  getWebEmbeddingModel,
} from "@/managers/embedding";
import type { EmbeddingModelManager } from "@/managers/embedding/manager";
import {
  createDesktopLanguageModelManager,
  getDesktopLanguageModel,
} from "@/managers/language/desktop";
import type { LanguageModelManager } from "@/managers/language/manager";
import {
  createWebLanguageModelManager,
  getWebLanguageModel,
} from "@/managers/language/web";
import {
  createDesktopVisionManager,
  createWebVisionManager,
  getDesktopVisionModel,
  getWebVisionModel,
} from "@/managers/vision";
import type { VisionModelManager } from "@/managers/vision/manager";

export type AiRuntime = "web" | "desktop";

export const runtimeState: {
  currentRuntime: AiRuntime;
  languageModelManager: LanguageModelManager | undefined;
  embeddingModelManager: EmbeddingModelManager | undefined;
  visionModelManager: VisionModelManager | undefined;
} = {
  currentRuntime: "web",
  languageModelManager: undefined,
  embeddingModelManager: undefined,
  visionModelManager: undefined,
};

// Sets the runtime and initializes all model managers.
export const initAiRuntime = (runtime: AiRuntime): void => {
  runtimeState.currentRuntime = runtime;
  switch (runtime) {
    case "desktop":
      runtimeState.languageModelManager = createDesktopLanguageModelManager();
      runtimeState.embeddingModelManager = createDesktopEmbeddingManager();
      runtimeState.visionModelManager = createDesktopVisionManager();
      break;
    case "web":
      initWebModelCache();
      runtimeState.languageModelManager = createWebLanguageModelManager();
      runtimeState.embeddingModelManager = createWebEmbeddingManager();
      runtimeState.visionModelManager = createWebVisionManager();
      break;
  }
};

// Returns the language model for the current runtime.
export const getLanguageModel = (): LanguageModelV3 => {
  switch (runtimeState.currentRuntime) {
    case "desktop":
      return getDesktopLanguageModel();
    case "web":
      return getWebLanguageModel();
  }
};

export const getLanguageModelManager = (): LanguageModelManager => {
  if (!runtimeState.languageModelManager) {
    throw new Error("Language model manager not initialized.");
  }
  return runtimeState.languageModelManager;
};

// Returns the embedding model for the current runtime.
export const getEmbeddingModel = (): EmbeddingModelV3 => {
  switch (runtimeState.currentRuntime) {
    case "desktop":
      return getDesktopEmbeddingModel();
    case "web":
      return getWebEmbeddingModel();
  }
};

// Returns the vision model for the current runtime.
export const getVisionModel = (): LanguageModelV3 => {
  switch (runtimeState.currentRuntime) {
    case "desktop":
      return getDesktopVisionModel();
    case "web":
      return getWebVisionModel();
  }
};

export const getEmbeddingModelManager = (): EmbeddingModelManager => {
  if (!runtimeState.embeddingModelManager) {
    throw new Error("Embedding model manager not initialized.");
  }
  return runtimeState.embeddingModelManager;
};

export const getVisionModelManager = (): VisionModelManager => {
  if (!runtimeState.visionModelManager) {
    throw new Error("Vision model manager not initialized.");
  }
  return runtimeState.visionModelManager;
};

export const getRuntime = (): AiRuntime => {
  return runtimeState.currentRuntime;
};
