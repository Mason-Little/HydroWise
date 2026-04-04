import type {
  ChatOrchestratorInput,
  ChatOrchestratorOutput,
} from "@hydrowise/entities";
import { ChatOrchestratorOutputSchema } from "@hydrowise/entities";
import { Output, streamText } from "ai";
import { getLanguageModel } from "@/runtime";
import { buildOrchestratorUserPrompt, orchestratorSystemPrompt } from "./confg";

export const runChatOrchestrator = async (
  input: ChatOrchestratorInput,
): Promise<ChatOrchestratorOutput> => {
  const { partialOutputStream, output } = streamText({
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

  for await (const chunk of partialOutputStream) {
    console.log("text", chunk);
  }

  return await output;
};
