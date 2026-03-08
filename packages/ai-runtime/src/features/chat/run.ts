import { generateText, streamText } from "ai";
import { getLanguageModel } from "../../init";
import type { ChatRunInput, ChatRunResult, ChatRunStreamResult } from "./types";

export async function runChat(input: ChatRunInput): Promise<ChatRunResult> {
  const model = getLanguageModel();

  const result = await generateText({
    model,
    messages: [
      {
        role: "user",
        content: [{ type: "text", text: input.prompt }],
      },
    ],
  });

  return {
    text: result.text,
  };
}

export async function runChatStream(
  input: ChatRunInput,
): Promise<ChatRunStreamResult> {
  const model = getLanguageModel();

  const result = streamText({
    model,
    messages: [
      { role: "user", content: [{ type: "text", text: input.prompt }] },
    ],
  });
  return {
    textStream: result.textStream,
  };
}
