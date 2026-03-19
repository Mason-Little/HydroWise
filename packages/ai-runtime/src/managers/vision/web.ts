import type { LanguageModelV3 } from "@ai-sdk/provider";
import { createWebVisionAdapter } from "@/adapters/web/vision";
import { initWebModelCache, isWebModelCached } from "@/backends/web/cache";
import { downloadWebModel, warmWebModel } from "@/backends/web/loader";
import { getVisionModelDefinition } from "@/config/queries";
import type { VisionModelManager } from "./manager";

const webVisionState: { activeModel: LanguageModelV3 | undefined } = {
  activeModel: undefined,
};

// Builds the VisionModelManager implementation for web.
export const createWebVisionManager = (): VisionModelManager => ({
  downloadModel: async (callbacks) => {
    const { web } = getVisionModelDefinition();
    await downloadWebModel({ web, onProgress: callbacks.onProgress });
  },
  isModelCached: async () => {
    const { web } = getVisionModelDefinition();

    return isWebModelCached(web.modelId);
  },
  warmModel: async () => {
    const { web } = getVisionModelDefinition();
    const { model, processor } = await warmWebModel({ web });
    webVisionState.activeModel = createWebVisionAdapter(model, processor);
  },
  coolModel: async () => {
    webVisionState.activeModel = undefined;
  },
});

// Initializes the web vision model cache.
export const initWebVisionManager = () => {
  initWebModelCache();
};

// Returns the currently loaded web vision model or throws.
export const getWebVisionModel = (): LanguageModelV3 => {
  if (!webVisionState.activeModel) {
    throw new Error("Vision model not loaded.");
  }
  return webVisionState.activeModel;
};
