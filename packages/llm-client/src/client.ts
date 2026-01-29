import {
  type ChatCompletionMessageParam,
  CreateMLCEngine,
  type MLCEngine,
} from "@mlc-ai/web-llm";

const DEFAULT_MODEL = "Llama-3.2-1B-Instruct-q4f16_1-MLC";
const DEFAULT_TEMPERATURE = 0.6;
const DEFAULT_MAX_TOKENS = 128;

export type WebLLMEngine = MLCEngine;

export const createWebLLMEngine = async (
  onProgress?: (progress: number) => void,
): Promise<WebLLMEngine> =>
  CreateMLCEngine(DEFAULT_MODEL, {
    initProgressCallback: (report) => {
      if (!onProgress || report.progress === undefined) return;
      onProgress(Math.round(report.progress * 100));
    },
  });

export const runDefaultCompletion = async (
  engine: WebLLMEngine,
  prompt: string,
): Promise<string> => {
  const completion = await engine.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    temperature: DEFAULT_TEMPERATURE,
    max_tokens: DEFAULT_MAX_TOKENS,
  });

  return completion.choices[0]?.message?.content ?? "";
};

export const sendChatCompletion = async (
  engine: WebLLMEngine,
  messages: ChatCompletionMessageParam[],
): Promise<string> => {
  const completion = await engine.chat.completions.create({
    stream: false,
    messages,
    model: DEFAULT_MODEL,
    temperature: DEFAULT_TEMPERATURE,
    max_tokens: DEFAULT_MAX_TOKENS,
  });

  return completion.choices[0]?.message?.content ?? "";
};
