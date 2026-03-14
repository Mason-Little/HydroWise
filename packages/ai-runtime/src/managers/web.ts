import type { LanguageModelV3 } from "@ai-sdk/provider";
import { createWebLanguageModelAdapter } from "@/adapters/web/language-model";
import {
  initWebModelCache,
  listCachedWebModelTiers,
} from "@/backends/web/cache";
import { downloadWebModel, warmWebModel } from "@/backends/web/loader";
import type { LanguageModelManager } from "@/managers/manager";

const webLanguageModelState: {
  activeLanguageModel: LanguageModelV3 | undefined;
} = {
  activeLanguageModel: undefined,
};

// Builds the LanguageModelManager implementation for web.
export const createWebLanguageModelManager = (): LanguageModelManager => {
  return {
    // TODO: Web download progress jumps around because each model file (embed_tokens,
    // vision_encoder, decoder_model_merged) reports its own independent progress,
    // causing the overall bar to reset and spike per-file rather than tracking total bytes.
    downloadModel: async (tier, callbacks) => {
      await downloadWebModel({ tier, onProgress: callbacks.onProgress });
    },
    warmModel: async (tier) => {
      const { model, processor } = await warmWebModel({ tier });
      webLanguageModelState.activeLanguageModel = createWebLanguageModelAdapter(
        model,
        processor,
      );
    },
    listCachedModels: async () => {
      return listCachedWebModelTiers();
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
