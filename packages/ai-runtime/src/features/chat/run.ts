import { generateText, streamText } from "ai";
import { getLanguageModel } from "../../runtime";
import type { ChatRunInput, ChatRunResult, ChatRunStreamResult } from "./types";

export const runChat = async (input: ChatRunInput): Promise<ChatRunResult> => {
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
};

export const runChatStream = async (
  input: ChatRunInput,
): Promise<ChatRunStreamResult> => {
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
};
