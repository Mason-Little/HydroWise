import type { ConversationMessage } from "@hydrowise/entities";
import { initDesktopLLMClient } from "./desktop/init/chat";
import { initDesktopEmbeddings } from "./desktop/init/embedding";
import { initDesktopVisionModel } from "./desktop/init/image";
import { sendDesktopChatCompletion } from "./desktop/run/chat";
import { sendDesktopEmbeddings } from "./desktop/run/embeddings";
import { processDesktopImage } from "./desktop/run/image";
import { postprocessDesktopOcrText } from "./desktop/run/ocr";
import { sendDesktopQuiz } from "./desktop/run/quiz";
import { initWebLLMEngine } from "./web/init/chat";
import { initWebEmbeddings } from "./web/init/embeddings";
import { initWebVisionModel } from "./web/init/image";
import { configureWebModelLogging } from "./web/init/logging";
import { sendWebChatCompletion } from "./web/run/chat";
import { sendWebEmbeddings } from "./web/run/embeddings";
import { processWebImage } from "./web/run/image";
import { postprocessWebOcrText } from "./web/run/ocr";

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

export const sendChatCompletion = (
  history: ConversationMessage[],
  query: ConversationMessage,
  contextInjection: string,
  onChunk: (chunk: string) => void,
) => {
  const mode = getRuntimeMode();
  return mode === "web"
    ? sendWebChatCompletion(history, query, contextInjection, onChunk)
    : sendDesktopChatCompletion(history, query, contextInjection, onChunk);
};

export const sendEmbeddings = async (values: string[]) => {
  const mode = getRuntimeMode();
  return mode === "web"
    ? await sendWebEmbeddings(values)
    : await sendDesktopEmbeddings(values);
};

export const sendEmbedding = async (text: string) => {
  const embeddings = await sendEmbeddings([text]);
  return embeddings[0];
};

export const processImage = async (image: File) => {
  const mode = getRuntimeMode();
  return mode === "web" ? processWebImage(image) : processDesktopImage(image);
};

export const postprocessOcrText = async (ocrText: string) => {
  const mode = getRuntimeMode();
  return mode === "web"
    ? postprocessWebOcrText(ocrText)
    : postprocessDesktopOcrText(ocrText);
};

export const sendQuiz = async (messages: ConversationMessage) => {
  const mode = getRuntimeMode();
  return mode === "web" ? "not ready yet" : sendDesktopQuiz(messages);
};

export const initLLMClient = (onProgress?: (progress: number) => void) => {
  const mode = getRuntimeMode();
  if (mode === "web") configureWebModelLogging();
  return mode === "web"
    ? initWebLLMEngine(onProgress)
    : initDesktopLLMClient(onProgress);
};

export const initVisionModel = (onProgress?: (progress: number) => void) => {
  const mode = getRuntimeMode();
  if (mode === "web") configureWebModelLogging();
  return mode === "web"
    ? initWebVisionModel(onProgress)
    : initDesktopVisionModel(onProgress);
};

export const initEmbeddings = (onProgress?: (progress: number) => void) => {
  const mode = getRuntimeMode();
  if (mode === "web") configureWebModelLogging();
  return mode === "web"
    ? initWebEmbeddings(onProgress)
    : initDesktopEmbeddings(onProgress);
};

export const initAllEngines = (onProgress?: (progress: number) => void) => {
  const mode = getRuntimeMode();
  if (mode === "web") configureWebModelLogging();
  return mode === "web"
    ? Promise.all([
        initWebLLMEngine(onProgress),
        initWebVisionModel(onProgress),
        initWebEmbeddings(onProgress),
      ])
    : Promise.all([
        initDesktopLLMClient(onProgress),
        initDesktopVisionModel(onProgress),
        initDesktopEmbeddings(onProgress),
      ]);
};
