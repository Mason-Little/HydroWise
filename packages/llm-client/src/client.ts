import type { ChatCompletionMessageParam } from "@mlc-ai/web-llm";
import { sendDesktopChatCompletion } from "./desktop/completion";
import { initDesktopLLMClient } from "./desktop/init";
import { sendChatCompletion as sendWebChatCompletion } from "./web/completion";
import { initWebLLMEngine } from "./web/init";

const runtime = import.meta.env.VITE_RUNTIME;

export const initLLMClient = async (
  onProgress?: (progress: number) => void,
): Promise<void> => {
  if (runtime === "web") {
    await initWebLLMEngine(onProgress);
  } else {
    await initDesktopLLMClient(onProgress);
  }
};

export const sendChatCompletion = async (
  history: ChatCompletionMessageParam[],
  prompt: ChatCompletionMessageParam,
): Promise<string> => {
  if (runtime === "web") {
    return sendWebChatCompletion([...history, prompt]);
  } else {
    return sendDesktopChatCompletion([...history, prompt]);
  }
};
