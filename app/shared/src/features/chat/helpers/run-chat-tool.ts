import { embedText, sendGroundedChat } from "@hydrowise/ai-runtime";
import { getQueries } from "@hydrowise/data";
import type { ChatOrchestratorOutput } from "@hydrowise/entities";

const runGroundedChatTool = async (retrievalQuery: string) => {
  const embedding = await embedText(retrievalQuery);
  const { searchPages } = await getQueries();
  const retrievedContext = await searchPages(embedding);
  return sendGroundedChat({ query: retrievalQuery, retrievedContext });
};

export const runChatTool = async (plan: ChatOrchestratorOutput) => {
  const { toolCall } = plan;
  if (!toolCall || toolCall.toolName !== "grounded-response") {
    return;
  }
  return runGroundedChatTool(toolCall.args.retrievalQuery);
};
