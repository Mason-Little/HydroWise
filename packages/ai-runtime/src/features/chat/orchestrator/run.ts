import type { ChatOrchestratorInput } from "@hydrowise/entities";
import { ChatOrchestratorOutputSchema } from "@hydrowise/entities";
import { Output, streamText } from "ai";
import { getLanguageModel } from "@/runtime";
import { buildOrchestratorUserPrompt, orchestratorSystemPrompt } from "./confg";

export const runChatOrchestrator = (input: ChatOrchestratorInput) => {
  return streamText({
    model: getLanguageModel(),
    system: orchestratorSystemPrompt,
    prompt: buildOrchestratorUserPrompt(input),
    temperature: 0,
    topP: 1,
    output: Output.object({
      name: "chat-orchestrator",
      description: "Orchestrator plan: tool call and metadata",
      schema: ChatOrchestratorOutputSchema,
    }),
  });
};
