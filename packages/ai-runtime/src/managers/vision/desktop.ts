import type { LanguageModelV3 } from "@ai-sdk/provider";
import { createDesktopVisionAdapter } from "@/adapters/desktop/vision";
import {
  coolDesktopVisionModel,
  downloadDesktopVisionModel,
  isDesktopVisionModelCached,
  warmDesktopVisionModel,
} from "@/backends/desktop/vision-service";
import type { VisionModelManager } from "./manager";

const desktopVisionState: { activeModel: LanguageModelV3 | undefined } = {
  activeModel: undefined,
};

// Builds the VisionModelManager implementation for desktop.
export const createDesktopVisionManager = (): VisionModelManager => ({
  downloadModel: async (callbacks) => {
    await downloadDesktopVisionModel({ onProgress: callbacks.onProgress });
  },
  isModelCached: async () => {
    return isDesktopVisionModelCached();
  },
  warmModel: async () => {
    const modelId = await warmDesktopVisionModel();
    desktopVisionState.activeModel = createDesktopVisionAdapter(modelId);
  },
  coolModel: async () => {
    await coolDesktopVisionModel();
    desktopVisionState.activeModel = undefined;
  },
});

// Returns the currently loaded desktop vision model or throws.
export const getDesktopVisionModel = (): LanguageModelV3 => {
  if (!desktopVisionState.activeModel) {
    throw new Error("Vision model not loaded.");
  }
  return desktopVisionState.activeModel;
};
