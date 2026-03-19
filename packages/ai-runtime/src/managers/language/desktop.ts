import type { LanguageModelV3 } from "@ai-sdk/provider";
import { createDesktopLanguageModelAdapter } from "@/adapters/desktop/language-model";
import {
  coolDesktopModel,
  downloadDesktopModel,
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
    // TODO: Desktop download progress updates arrive infrequently (every 10-20s) with
    // large percent jumps. Progress granularity is controlled by the llama.cpp/Tauri
    // backend — needs either more frequent emission or client-side interpolation.
    downloadModel(tier, callbacks) {
      return downloadDesktopModel({
        tier,
        onProgress: callbacks.onProgress,
      });
    },
    async warmModel(tier) {
      const modelId = await warmDesktopModel(tier);
      desktopLanguageModelState.activeLanguageModel =
        createDesktopLanguageModelAdapter(modelId);
    },
    async coolModel(tier) {
      await coolDesktopModel(tier);
    },
    listCachedModels() {
      return listCachedDesktopModels();
    },
  };
};

// Returns the currently warmed desktop model or throws.
export const getDesktopLanguageModel = () => {
  if (!desktopLanguageModelState.activeLanguageModel) {
    throw new Error("Language model not loaded.");
  }

  return desktopLanguageModelState.activeLanguageModel;
};
