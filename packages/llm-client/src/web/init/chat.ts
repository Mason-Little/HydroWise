import {
  doesBrowserSupportTransformersJS,
  transformersJS,
} from "@browser-ai/transformers-js";

const modelId = "Xenova/Phi-3-mini-4k-instruct";

const model = transformersJS(modelId, {
  device: "webgpu",
});

export const initWebLLMEngine = async (
  onProgress?: (progress: number) => void,
): Promise<void> => {
  if (!doesBrowserSupportTransformersJS()) {
    return;
  }

  const availability = await model.availability();
  if (availability === "unavailable") {
    return;
  }
  if (availability === "downloadable") {
    await model.createSessionWithProgress((progress) => {
      if (!onProgress || progress === undefined) return;
      onProgress(Math.round(progress * 100));
    });
  }
};

export const getWebLLMEngine = () => {
  return model;
};
