import type { LanguageModelV3 } from "@ai-sdk/provider";
import {
  getDesktopLanguageModel,
  initDesktopModelManager,
} from "@/managers/desktop";
import { getWebLanguageModel, initWebModelManager } from "@/managers/web";

export type AiRuntime = "web" | "desktop";

const runtimeState: {
  currentRuntime: AiRuntime;
} = {
  currentRuntime: "web",
};

// Sets the runtime and initializes the matching model manager.
export const initAiRuntime = (runtime: AiRuntime): void => {
  runtimeState.currentRuntime = runtime;
  switch (runtime) {
    case "desktop":
      initDesktopModelManager();
      break;
    case "web":
      initWebModelManager();
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
