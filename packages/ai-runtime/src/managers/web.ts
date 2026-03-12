import type { LanguageModelV3 } from "@ai-sdk/provider";
import { createWebLanguageModelAdapter } from "@/adapters/web/language-model";
import {
  initWebModelCache,
  listCachedWebModelTiers,
} from "@/backends/web/cache";
import { downloadWebModel } from "@/backends/web/loader";
import { getLanguageModelDefinition } from "@/config/queries";
import type { LanguageModelManager } from "@/managers/manager";

const webLanguageModelState: {
  activeLanguageModel: LanguageModelV3 | undefined;
} = {
  activeLanguageModel: undefined,
};

// Builds the LanguageModelManager implementation for web.
export const createWebLanguageModelManager = (): LanguageModelManager => {
  return {
    downloadModel: async (tier, callbacks) => {
      const { model, processor } = await downloadWebModel({
        tier,
        onProgress: callbacks.onProgress,
      });
      webLanguageModelState.activeLanguageModel = createWebLanguageModelAdapter(
        model,
        processor,
      );
      callbacks.onWarmed();
    },
    listCachedModels: async () => {
      return listCachedWebModelTiers();
    },
    warmModel: async (tier, callbacks) => {
      const definition = getLanguageModelDefinition(tier);

      if (!definition.webModelId) {
        throw new Error(`Model ${tier} is not available on web.`);
      }

      const { model, processor } = await downloadWebModel({ tier });
      webLanguageModelState.activeLanguageModel = createWebLanguageModelAdapter(
        model,
        processor,
      );
      callbacks.onWarmed();
    },
  };
};

// Initializes the web model cache.
export const initWebModelManager = () => {
  initWebModelCache();
};

// Returns the currently loaded web model or throws.
export const getWebLanguageModel = () => {
  if (!webLanguageModelState.activeLanguageModel) {
    throw new Error(`Language model not loaded.`);
  }

  return webLanguageModelState.activeLanguageModel;
};
