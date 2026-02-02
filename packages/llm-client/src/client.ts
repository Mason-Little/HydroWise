import type { Message } from "@hydrowise/entities";
import { sendChatCompletion as sendDesktopChatCompletion } from "./desktop/completion";
import { getEmbeddings as sendDesktopEmbeddings } from "./desktop/embeddings";
import { initDesktopLLMClient } from "./desktop/init";
import { sendChatCompletion as sendWebChatCompletion } from "./web/completion";
import { getEmbeddings as sendWebEmbeddings } from "./web/embeddings";
import { initWebLLMEngine } from "./web/init";

const runtime = import.meta.env.VITE_RUNTIME;

export const initLLMClient = (onProgress?: (progress: number) => void) =>
  runtime === "web"
    ? initWebLLMEngine(onProgress)
    : initDesktopLLMClient(onProgress);

export const sendChatCompletion = (
  messages: Message[],
  onChunk: (chunk: string) => void,
) =>
  runtime === "web"
    ? sendWebChatCompletion(messages, onChunk)
    : sendDesktopChatCompletion(messages, onChunk);

export const sendEmbeddings = async (values: string[]) =>
  runtime === "web"
    ? await sendWebEmbeddings(values)
    : await sendDesktopEmbeddings(values);
