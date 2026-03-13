import { generateText, Output } from "ai";
import { z } from "zod";
import { getLanguageModel } from "@/runtime";

export const sendGroundedChat = async (input: string) => {
  const model = getLanguageModel();

  const result = await generateText({
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

  console.log("result");
  console.log(result);

  return result.output;
};
