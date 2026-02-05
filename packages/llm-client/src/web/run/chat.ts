import type { Message } from "@hydrowise/entities";
import { streamText } from "ai";
import { getWebLLMEngine } from "../init/chat";

export const sendWebChatCompletion = async (
  messages: Message[],
  onChunk: (chunk: string) => void,
): Promise<string> => {
  const result = streamText({
    model: getWebLLMEngine(),
    messages: messages.map((m) => ({
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
