import {
  type ChatGroundedInput,
  type GroundedAssistantMessagePayload,
  GroundedAssistantMessagePayloadSchema,
} from "@hydrowise/entities";
import { Output, streamText } from "ai";
import { getLanguageModel } from "@/runtime";
import { groundedChatSystemPrompt } from "./config";

export type SendGroundedChatResult = {
  partialOutputStream: AsyncIterable<unknown>;
  output: Promise<GroundedAssistantMessagePayload>;
};

export const sendGroundedChat = (input: ChatGroundedInput): SendGroundedChatResult => {
  const { query, retrievedContext } = input;
  const model = getLanguageModel();
  const { partialOutputStream, output } = streamText({
    model,
    system: groundedChatSystemPrompt(retrievedContext),
    prompt: query,
    temperature: 0,
    topP: 1,
    output: Output.object({
      name: "chat",
      description: "chat response",
      schema: GroundedAssistantMessagePayloadSchema,
    }),
  });
  return {
    partialOutputStream,
    output: output as Promise<GroundedAssistantMessagePayload>,
  };
};
