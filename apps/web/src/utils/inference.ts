import { CreateMLCEngine, type MLCEngine } from "@mlc-ai/web-llm";

const DEFAULT_MODEL = "Llama-3.2-1B-Instruct-q4f16_1-MLC";

export type WebLLMEngine = MLCEngine;

export const createWebLLMEngine = async (
  onProgress?: (progress: number) => void,
) =>
  CreateMLCEngine(DEFAULT_MODEL, {
    initProgressCallback: (report) => {
      if (!onProgress || report.progress === undefined) return;
      onProgress(Math.round(report.progress * 100));
    },
  });

export const runDefaultCompletion = async (
  engine: MLCEngine,
  prompt: string,
) => {
  const completion = await engine.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    temperature: 0.6,
    max_tokens: 128,
  });

  return completion.choices[0]?.message?.content ?? "";
};
