import type {
  Chapter,
  ChunkIdeaResult,
  ConversationMessage,
  Course,
  EmbeddingChunk,
  Topic,
  TopicAssessmentInputChunk,
  TopicAssessmentResult,
} from "@hydrowise/entities";
import { initDesktopLLMClient } from "./desktop/init/chat";
import { initDesktopEmbeddings } from "./desktop/init/embedding";
import { initDesktopVisionModel } from "./desktop/init/image";
import { sendDesktopChatCompletion } from "./desktop/run/chat";
import { sendDesktopChunkIdea } from "./desktop/run/chunk-idea";
import { sendDesktopEmbeddings } from "./desktop/run/embeddings";
import { processDesktopImage } from "./desktop/run/image";
import { postprocessDesktopOcrText } from "./desktop/run/ocr";
import { sendDesktopQuiz } from "./desktop/run/quiz";
import { sendDesktopTopicIdea } from "./desktop/run/topic-idea";

const getRuntimeMode = () => {
  // Handle Vite/Browser environment
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_RUNTIME) {
    return import.meta.env.VITE_RUNTIME;
  }
  // Handle Node/Bun environment
  const runtimeMode = (
    globalThis as { process?: { env?: { RUNTIME_MODE?: string } } }
  ).process?.env?.RUNTIME_MODE;
  if (runtimeMode) {
    return runtimeMode;
  }
  return "web";
};

const assertWebRuntimeDisabled = (mode: string, operation: string) => {
  if (mode !== "web") return;

  throw new Error(
    `${operation} is disabled in web runtime. WebLLM is feature-flagged off right now. Run with VITE_RUNTIME=desktop.`,
  );
};

export const sendChatCompletion = (
  history: ConversationMessage[],
  query: ConversationMessage,
  contextInjection: string,
  onChunk: (chunk: string) => void,
) => {
  const mode = getRuntimeMode();
  assertWebRuntimeDisabled(mode, "sendChatCompletion");
  return sendDesktopChatCompletion(history, query, contextInjection, onChunk);
};

export const sendEmbeddings = async (values: string[]) => {
  const mode = getRuntimeMode();
  assertWebRuntimeDisabled(mode, "sendEmbeddings");
  return await sendDesktopEmbeddings(values);
};

export const sendEmbedding = async (text: string) => {
  const embeddings = await sendEmbeddings([text]);
  return embeddings[0];
};

export const processImage = async (image: File) => {
  const mode = getRuntimeMode();
  assertWebRuntimeDisabled(mode, "processImage");
  return processDesktopImage(image);
};

export const postprocessOcrText = async (ocrText: string) => {
  const mode = getRuntimeMode();
  assertWebRuntimeDisabled(mode, "postprocessOcrText");
  return postprocessDesktopOcrText(ocrText);
};

export const sendChunkIdea = async (
  chunk: EmbeddingChunk,
  documentName: string,
  course: Course | null,
  chapter: Chapter | null,
): Promise<ChunkIdeaResult> => {
  const mode = getRuntimeMode();
  assertWebRuntimeDisabled(mode, "sendChunkIdea");

  return sendDesktopChunkIdea(chunk, documentName, course, chapter);
};

export const sendTopicIdea = async (
  chunks: TopicAssessmentInputChunk[],
  course: Course | null,
  chapter: Chapter | null,
  documentName: string,
  existingTopics: Pick<Topic, "name" | "description">[] = [],
): Promise<TopicAssessmentResult> => {
  const mode = getRuntimeMode();
  assertWebRuntimeDisabled(mode, "sendTopicIdea");

  return sendDesktopTopicIdea(
    chunks,
    course,
    chapter,
    documentName,
    existingTopics,
  );
};

export const sendQuiz = async (messages: ConversationMessage) => {
  const mode = getRuntimeMode();
  assertWebRuntimeDisabled(mode, "sendQuiz");
  return sendDesktopQuiz(messages);
};

export const initLLMClient = (onProgress?: (progress: number) => void) => {
  const mode = getRuntimeMode();
  assertWebRuntimeDisabled(mode, "initLLMClient");
  return initDesktopLLMClient(onProgress);
};

export const initVisionModel = (onProgress?: (progress: number) => void) => {
  const mode = getRuntimeMode();
  assertWebRuntimeDisabled(mode, "initVisionModel");
  return initDesktopVisionModel(onProgress);
};

export const initEmbeddings = (onProgress?: (progress: number) => void) => {
  const mode = getRuntimeMode();
  assertWebRuntimeDisabled(mode, "initEmbeddings");
  return initDesktopEmbeddings(onProgress);
};

export const initAllEngines = (onProgress?: (progress: number) => void) => {
  const mode = getRuntimeMode();
  assertWebRuntimeDisabled(mode, "initAllEngines");
  return Promise.all([
    initDesktopLLMClient(onProgress),
    initDesktopVisionModel(onProgress),
    initDesktopEmbeddings(onProgress),
  ]);
};
