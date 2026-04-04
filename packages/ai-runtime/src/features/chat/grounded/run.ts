import {
  type ChatGroundedInput,
  type ChatGroundedOutput,
  ChatGroundedOutputSchema,
} from "@hydrowise/entities";
import { Output, streamText } from "ai";
import { getLanguageModel } from "@/runtime";
import { groundedChatSystemPrompt } from "./config";

export const sendGroundedChat = async (
  input: ChatGroundedInput,
): Promise<ChatGroundedOutput> => {
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
      schema: ChatGroundedOutputSchema,
    }),
  });

  return output;
};
