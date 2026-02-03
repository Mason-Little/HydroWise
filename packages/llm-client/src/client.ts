import type { Message } from "@hydrowise/entities";
import { sendChatCompletion as sendDesktopChatCompletion } from "./desktop/completion";
import { getEmbeddings as sendDesktopEmbeddings } from "./desktop/embeddings";
import { initDesktopLLMClient } from "./desktop/init";
import { sendChatCompletion as sendWebChatCompletion } from "./web/completion";
import { getEmbeddings as sendWebEmbeddings } from "./web/embeddings";
import { initWebLLMEngine } from "./web/init";

const getRuntimeMode = () => {
  // Handle Vite/Browser environment
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_RUNTIME) {
    return import.meta.env.VITE_RUNTIME;
  }
  // Handle Node/Bun environment
  if (typeof process !== "undefined" && process.env?.RUNTIME_MODE) {
    return process.env.RUNTIME_MODE;
  }
  return "web";
};

export const initLLMClient = (onProgress?: (progress: number) => void) => {
  const mode = getRuntimeMode();
  return mode === "web"
    ? initWebLLMEngine(onProgress)
    : initDesktopLLMClient(onProgress);
};

export const sendChatCompletion = (
  messages: Message[],
  onChunk: (chunk: string) => void,
) => {
  const mode = getRuntimeMode();
  return mode === "web"
    ? sendWebChatCompletion(messages, onChunk)
    : sendDesktopChatCompletion(messages, onChunk);
};

export const sendEmbeddings = async (values: string[]) => {
  const mode = getRuntimeMode();
  return mode === "web"
    ? await sendWebEmbeddings(values)
    : await sendDesktopEmbeddings(values);
};
