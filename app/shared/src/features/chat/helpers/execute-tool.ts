import { embedText, sendGroundedChat } from "@hydrowise/ai-runtime";
import { getQueries } from "@hydrowise/data";
import type { ChatOrchestratorOutput } from "@hydrowise/entities";

export const executeTool = async (plan: ChatOrchestratorOutput) => {
  switch (plan.toolCall?.toolName) {
    case "grounded-response":
      return runGroundedChatTool(plan.toolCall.args.retrievalQuery);
    default:
      return;
  }
};

const runGroundedChatTool = async (retrievalQuery: string) => {
  const embedding = await embedText(retrievalQuery);
  const { searchPages } = await getQueries();
  const retrievedContext = await searchPages(embedding);
  return sendGroundedChat({ query: retrievalQuery, retrievedContext });
};
