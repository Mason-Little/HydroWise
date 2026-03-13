import { Output, streamText } from "ai";
import { z } from "zod";
import { getLanguageModel } from "@/runtime";

export const sendGroundedChat = async (input: string) => {
  const model = getLanguageModel();

  const { partialOutputStream, output } = streamText({
    model,
    prompt: input,
    temperature: 0,
    topP: 1,
    output: Output.object({
      name: "chat",
      description: "chat response",
      schema: z.object({
        responseIdeas: z.array(z.string()).length(3),
      }),
    }),
  });

  for await (const text of partialOutputStream) {
    console.log("text", text);
  }

  return output;
};
