import type { ChatMessage } from "@hydrowise/entities";
import { streamText } from "ai";
import { getLanguageModel } from "../../../init/language";
import { systemPrompt } from "./config";

export const generateGroundedResponse = async (
  userPrompt: ChatMessage,
  history: ChatMessage[],
  contextInjection: string,
  onChunk: (chunk: string) => void,
) => {
  const model = getLanguageModel();
  const result = await streamText({
    system: systemPrompt(contextInjection),
    model,
    messages: [...history, userPrompt].map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  for await (const text of result.textStream) {
    onChunk(text);
  }

  return result.text;
};
