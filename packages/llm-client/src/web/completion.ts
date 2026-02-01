import { webLLM } from "@browser-ai/web-llm";
import type { Message } from "@hydrowise/entities";
import { streamText } from "ai";
import { LLM_CONFIG } from "../config";

export const sendChatCompletion = async (
  messages: Message[],
  onChunk: (chunk: string) => void,
): Promise<string> => {
  const result = streamText({
    model: webLLM(LLM_CONFIG.model),
    messages,
    temperature: LLM_CONFIG.temperature,
    maxOutputTokens: LLM_CONFIG.maxTokens,
  });

  const chunks: string[] = [];
  for await (const text of result.textStream) {
    chunks.push(text);
    onChunk(text);
  }

  return chunks.join("");
};
