import { CreateMLCEngine, type MLCEngine } from "@mlc-ai/web-llm";

type EngineState = {
  engine: MLCEngine | null;
};

const engineState: EngineState = {
  engine: null,
};

export const initWebLLMEngine = (
  model: string,
  onProgress?: (progress: number) => void,
): Promise<MLCEngine> => {
  if (engineState.engine) return Promise.resolve(engineState.engine);

  const enginePromise = CreateMLCEngine(model, {
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
