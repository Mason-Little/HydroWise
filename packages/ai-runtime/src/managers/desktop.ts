import type { LanguageModelV3 } from "@ai-sdk/provider";
import { createDesktopLanguageModelAdapter } from "@/adapters/desktop/language-model";
import {
  downloadDesktopModel,
  ensureDesktopServerReady,
  listCachedDesktopModels,
  warmDesktopModel,
} from "@/backends/desktop/service";
import type { LanguageModelManager } from "./manager";

const desktopLanguageModelState: {
  activeLanguageModel: LanguageModelV3 | undefined;
} = {
  activeLanguageModel: undefined,
};

// Builds the LanguageModelManager implementation for desktop.
export const createDesktopLanguageModelManager = (): LanguageModelManager => {
  return {
    downloadModel(tier, callbacks) {
      return downloadDesktopModel({
        tier,
        onProgress: callbacks.onProgress,
      });
    },
    async warmModel(tier, callbacks) {
      const modelId = await warmDesktopModel(tier);
      desktopLanguageModelState.activeLanguageModel =
        createDesktopLanguageModelAdapter(modelId);
      callbacks.onWarmed();
    },
    listCachedModels() {
      return listCachedDesktopModels();
    },
  };
};

// Kicks off desktop server readiness in the background.
export const initDesktopModelManager = () => {
  void ensureDesktopServerReady();
};

// Returns the currently warmed desktop model or throws.
export const getDesktopLanguageModel = () => {
  if (!desktopLanguageModelState.activeLanguageModel) {
    throw new Error("Language model not loaded.");
  }

  return desktopLanguageModelState.activeLanguageModel;
};
