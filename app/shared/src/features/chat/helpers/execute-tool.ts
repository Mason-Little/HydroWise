import { embedText, sendGroundedChat } from "@hydrowise/ai-runtime";
import { getQueries } from "@hydrowise/data";
import type { ChatOrchestratorOutput } from "@hydrowise/entities";

export const executeTool = async (plan: ChatOrchestratorOutput) => {
  switch (plan.toolCall?.toolName) {
    case "grounded-response":
      return await runGroundedChatTool(plan.toolCall.args.retrievalQuery);
  }
};

const runGroundedChatTool = async (retrievalQuery: string) => {
  const embedding = await embedText(retrievalQuery);
  const retrievedContext = await getQueries().then((q) =>
    q.searchPages(embedding),
  );
  return await sendGroundedChat({
    query: retrievalQuery,
    retrievedContext: retrievedContext.map((page) => page.pageContent),
  });
};
