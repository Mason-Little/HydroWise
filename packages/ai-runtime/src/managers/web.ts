import type { LanguageModelV3 } from "@ai-sdk/provider";
import { createWebLanguageModelAdapter } from "@/adapters/web/language-model";
import { listCachedWebModelTiers } from "@/backends/web/cache";
import { downloadWebModel } from "@/backends/web/loader";
import type { LanguageModelManager } from "@/managers/manager";

const webLanguageModelState: {
  activeLanguageModel: LanguageModelV3 | undefined;
} = {
  activeLanguageModel: undefined,
};

export const createWebLanguageModelManager = (): LanguageModelManager => {
  return {
    downloadModel: async (tier, callbacks) => {
      const { model, processor } = await downloadWebModel(tier, {
        onProgress: callbacks?.onProgress,
      });
      webLanguageModelState.activeLanguageModel = createWebLanguageModelAdapter(
        model,
        processor,
      );
      callbacks?.onWarmed?.();
    },
    listCachedModels: async () => {
      return listCachedWebModelTiers();
    },
  };
};

export const getWebLanguageModel = () => {
  if (!webLanguageModelState.activeLanguageModel) {
    throw new Error(`Language model not found.`);
  }

  return webLanguageModelState.activeLanguageModel;
};
