import { webLLM } from "@browser-ai/web-llm";
import { LLM_CONFIG } from "../config";

type ModelInstance = ReturnType<typeof webLLM> | null;

const modelState: { model: ModelInstance } = {
  model: null,
};

export const initWebLLMEngine = async (
  onProgress?: (progress: number) => void,
): Promise<void> => {
  if (modelState.model) return;

  const model = webLLM(LLM_CONFIG.model, {
    initProgressCallback: (report) => {
      if (!onProgress || report.progress === undefined) return;
      onProgress(Math.round(report.progress * 100));
    },
  });

  // Pre-initialize the model by creating a session with progress
  await model.createSessionWithProgress((report) => {
    if (!onProgress || report.progress === undefined) return;
    onProgress(Math.round(report.progress * 100));
  });

  modelState.model = model;
};

export const getWebLLMModel = (): ModelInstance => {
  if (!modelState.model) {
    throw new Error("LLM model not initialized");
  }

  return modelState.model;
};
