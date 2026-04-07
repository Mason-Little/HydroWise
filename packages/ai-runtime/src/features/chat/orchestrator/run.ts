import type { ChatOrchestratorInput } from "@hydrowise/entities";
import { ChatOrchestratorOutputSchema } from "@hydrowise/entities";
import { Output, streamText } from "ai";
import { getLanguageModel } from "@/runtime";
import { buildOrchestratorUserPrompt, orchestratorSystemPrompt } from "./confg";

// I can't for the life of me figure out how to just have the model use the optional so we have to manually omit it.
const chatOrchestratorContinuationSchema = ChatOrchestratorOutputSchema.omit({
  activeCourse: true,
  threadTitle: true,
});

export const runChatOrchestrator = (input: ChatOrchestratorInput) => {
  const schema = input.isFirstTurn
    ? ChatOrchestratorOutputSchema
    : chatOrchestratorContinuationSchema;

  return streamText({
    model: getLanguageModel(),
    system: orchestratorSystemPrompt,
    prompt: buildOrchestratorUserPrompt(input),
    temperature: 0,
    topP: 1,
    output: Output.object({
      name: "chat-orchestrator",
      description: "Orchestrator plan: tool call and metadata",
      schema,
    }),
  });
};
