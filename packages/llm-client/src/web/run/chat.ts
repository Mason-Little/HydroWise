import type { Message } from "@hydrowise/entities";
import { streamText } from "ai";
import { chatPrompt } from "../../config";
import { buildPromptAwareMessages } from "../helpers/messages";
import { getWebLLMEngine } from "../init/chat";

export const sendWebChatCompletion = async (
  history: Message[],
  query: Message,
  contextInjection: string,
  onChunk: (chunk: string) => void,
): Promise<string> => {
  const result = streamText({
    model: getWebLLMEngine(),
    messages: buildPromptAwareMessages(chatPrompt(contextInjection), [
      ...history,
      query,
    ]),
  });

  const chunks: string[] = [];
  for await (const text of result.textStream) {
    chunks.push(text);
    onChunk(text);
  }

  return chunks.join("");
};
