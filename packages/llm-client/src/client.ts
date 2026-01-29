import type { ChatCompletionMessageParam } from "@mlc-ai/web-llm";
import { sendChatCompletion as sendWebChatCompletion } from "./web/completion";
import { initWebLLMEngine } from "./web/init";

declare global {
  interface ImportMeta {
    env?: {
      VITE_RUNTIME?: string;
    };
  }
}

const runtime = import.meta.env.VITE_RUNTIME ?? "web";
const DEFAULT_MODEL = "Llama-3.2-1B-Instruct-q4f16_1-MLC";

const assertWebRuntime = () => {
  if (runtime !== "web") {
    throw new Error("Unsupported runtime");
  }
};

export const initLLMClient = async (
  onProgress?: (progress: number) => void,
): Promise<void> => {
  assertWebRuntime();
  await initWebLLMEngine(DEFAULT_MODEL, onProgress);
};

export const sendChatCompletion = async (
  messages: ChatCompletionMessageParam[],
): Promise<string> => {
  assertWebRuntime();
  return sendWebChatCompletion(messages);
};
