import { createOpenAI } from "@ai-sdk/openai";
import type { ChatMessage } from "@hydrowise/entities";
import { streamText } from "ai";
import { chatPrompt } from "../../config";

const getOpenAIClient = () =>
  createOpenAI({
    baseURL: import.meta.env.VITE_DESKTOP_GEN_ENDPOINT,
    apiKey: "null",
  });

export const sendDesktopChatCompletion = async (
  history: ChatMessage[],
  query: ChatMessage,
  contextInjection: string,
  onChunk: (chunk: string) => void,
): Promise<string> => {
  const openai = getOpenAIClient();
  const result = streamText({
    system: chatPrompt(contextInjection),
    model: openai.chat("any"),
    messages: [...history, query].map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const chunks: string[] = [];
  for await (const text of result.textStream) {
    chunks.push(text);
    onChunk(text);
  }

  return chunks.join("");
};
