import { generateText, streamText } from "ai";
import { createHydroWiseWebModel } from "../../provider/language-model";
import type { ChatRunInput, ChatRunResult, ChatRunStreamResult } from "./types";

const model = createHydroWiseWebModel();

export async function runChat(input: ChatRunInput): Promise<ChatRunResult> {
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

export async function runChatStream(input: ChatRunInput): Promise<ChatRunStreamResult> {
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
