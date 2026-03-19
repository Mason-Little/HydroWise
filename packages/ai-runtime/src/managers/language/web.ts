import type { LanguageModelV3 } from "@ai-sdk/provider";
import { createWebLanguageModelAdapter } from "@/adapters/web/language-model";
import {
  isWebModelCached,
  listCachedWebModelTiers,
} from "@/backends/web/cache";
import { downloadWebModel, warmWebModel } from "@/backends/web/loader";
import {
  getDefaultLanguageModelTier,
  getLanguageModelDefinition,
} from "@/config/queries";
import type { LanguageModelManager } from "@/managers/language/manager";

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
      const { web } = getLanguageModelDefinition(tier);
      if (!web)
        throw new Error(`Language model ${tier} is not available on web.`);
      await downloadWebModel({ web, onProgress: callbacks.onProgress });
    },
    warmModel: async (tier) => {
      const { web } = getLanguageModelDefinition(tier);
      if (!web)
        throw new Error(`Language model ${tier} is not available on web.`);
      const { model, processor } = await warmWebModel({ web });
      webLanguageModelState.activeLanguageModel = createWebLanguageModelAdapter(
        model,
        processor,
      );
    },
    coolModel: async () => {
      webLanguageModelState.activeLanguageModel = undefined;
    },
    isDefaultModelCached: async () => {
      const defaultModelTier = getDefaultLanguageModelTier();
      const { web } = getLanguageModelDefinition(defaultModelTier);
      if (!web)
        throw new Error(
          `Language model ${defaultModelTier} is not available on web.`,
        );
      return isWebModelCached(web.modelId);
    },
    listCachedModels: async () => {
      return listCachedWebModelTiers();
    },
  };
};

// Returns the currently loaded web model or throws.
export const getWebLanguageModel = () => {
  if (!webLanguageModelState.activeLanguageModel) {
    throw new Error(`Language model not loaded.`);
  }

  return webLanguageModelState.activeLanguageModel;
};
