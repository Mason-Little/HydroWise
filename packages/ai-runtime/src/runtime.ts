import type { LanguageModelV3 } from "@ai-sdk/provider";
import {
  getDesktopLanguageModel,
  initDesktopModelManager,
} from "@/managers/desktop";
import {
  createWebLanguageModelManager,
  getWebLanguageModel,
  initWebModelManager,
} from "@/managers/web";
import { createDesktopLanguageModelManager } from "./managers/desktop";
import type { LanguageModelManager } from "./managers/manager";

export type AiRuntime = "web" | "desktop";

export const runtimeState: {
  currentRuntime: AiRuntime;
  languageModelManager: LanguageModelManager | undefined;
} = {
  currentRuntime: "web",
  languageModelManager: undefined,
};

// Sets the runtime and initializes the matching model manager.
export const initAiRuntime = (runtime: AiRuntime): void => {
  runtimeState.currentRuntime = runtime;
  switch (runtime) {
    case "desktop":
      initDesktopModelManager();
      runtimeState.languageModelManager = createDesktopLanguageModelManager();
      break;
    case "web":
      initWebModelManager();
      runtimeState.languageModelManager = createWebLanguageModelManager();
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

export const getRuntime = (): AiRuntime => {
  return runtimeState.currentRuntime;
};
