import {
  type ChatGroundedInput,
  GroundedAssistantMessagePayloadSchema,
  GroundedAssistantMessageStreamSchema,
} from "@hydrowise/entities";
import { Output, streamText } from "ai";
import { getLanguageModel } from "@/runtime";
import { groundedChatSystemPrompt } from "./config";

export const sendGroundedChat = async (input: ChatGroundedInput) => {
  const { query, retrievedContext } = input;
  const model = getLanguageModel();
  const { output } = streamText({
    model,
    system: groundedChatSystemPrompt(retrievedContext),
    prompt: query,
    temperature: 0,
    topP: 1,
    output: Output.object({
      name: "chat",
      description: "chat response",
      schema: GroundedAssistantMessageStreamSchema,
    }),
  });

  const streamed = GroundedAssistantMessageStreamSchema.parse(await output);
  return GroundedAssistantMessagePayloadSchema.parse({
    kind: "grounded-answer",
    text: streamed.text,
    refs: streamed.refs,
  });
};
