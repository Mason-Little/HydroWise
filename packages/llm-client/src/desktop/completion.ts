import { createOpenAI } from "@ai-sdk/openai";
import type { Message } from "@hydrowise/entities";
import { streamText } from "ai";

const getOpenAIClient = () =>
  createOpenAI({
    baseURL: import.meta.env.VITE_DESKTOP_GEN_ENDPOINT,
    apiKey: "null",
  });

export const sendChatCompletion = async (
  messages: Message[],
  onChunk: (chunk: string) => void,
): Promise<string> => {
  const openai = getOpenAIClient();
  const result = streamText({
    model: openai.chat("any"),
    messages,
  });

  const chunks: string[] = [];
  for await (const text of result.textStream) {
    chunks.push(text);
    onChunk(text);
  }

  return chunks.join("");
};
