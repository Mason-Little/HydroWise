import { CreateMLCEngine, type MLCEngine } from "@mlc-ai/web-llm";

type EngineState = {
  engine: MLCEngine | null;
};

const engineState: EngineState = {
  engine: null,
};

const DEFAULT_MODEL = "Llama-3.2-1B-Instruct-q4f16_1-MLC";

export const initWebLLMEngine = (
  onProgress?: (progress: number) => void,
): Promise<MLCEngine> => {
  if (engineState.engine) return Promise.resolve(engineState.engine);

  const enginePromise = CreateMLCEngine(DEFAULT_MODEL, {
    initProgressCallback: (report) => {
      if (!onProgress || report.progress === undefined) return;
      onProgress(Math.round(report.progress * 100));
    },
  }).then((engine) => {
    engineState.engine = engine;
    return engine;
  });

  return enginePromise;
};

export const getWebLLMEngine = (): MLCEngine => {
  if (!engineState.engine) {
    throw new Error("LLM engine not initialized");
  }

  return engineState.engine;
};
