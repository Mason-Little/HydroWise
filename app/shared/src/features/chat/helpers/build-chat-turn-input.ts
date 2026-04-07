import type { ChatOrchestratorInput } from "@hydrowise/entities";
import { getChatHistory } from "@/features/chat/helpers/get-history";
import { getWorkspaceContext } from "@/features/chat/helpers/get-workspace-context";

export const buildChatTurnInput = async (opts: {
  threadId: string;
  text: string;
}): Promise<ChatOrchestratorInput> => {
  const [recentMessages, workspaceContext] = await Promise.all([
    getChatHistory(opts.threadId),
    getWorkspaceContext(),
  ]);

  return {
    userMessage: opts.text,
    recentMessages,
    workspaceContext,
    isFirstTurn: recentMessages.length === 0,
  };
};
