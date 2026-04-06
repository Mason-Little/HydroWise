import { runChatOrchestrator } from "@hydrowise/ai-runtime";
import {
  type ChatOrchestratorInput,
  ChatOrchestratorInputSchema,
  type ChatOrchestratorOutput,
} from "@hydrowise/entities";

/** Runs the chat orchestrator and returns its structured plan (tool call + metadata). */
export const requestChatOrchestratorPlan = async (
  input: ChatOrchestratorInput,
): Promise<ChatOrchestratorOutput> => {
  const parsed = ChatOrchestratorInputSchema.parse(input);
  const { output } = await runChatOrchestrator(parsed);
  return output;
};
