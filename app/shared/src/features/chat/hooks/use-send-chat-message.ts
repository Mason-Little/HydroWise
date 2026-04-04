import { useCallback, useState } from "react";

import { buildChatTurnInput } from "@/features/chat/helpers/build-chat-turn-input";
import { ensureThreadForSend } from "@/features/chat/helpers/ensure-thread-for-send";
import { persistChatMessage } from "@/features/chat/helpers/persist-chat-message";
import { requestChatOrchestratorPlan } from "@/features/chat/helpers/request-chat-orchestrator-plan";

export const useSendChatMessage = (
  threadId: string | null,
  setThreadId: (id: string | null) => void,
) => {
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = useCallback(
    async (text: string) => {
      if (isStreaming) return;
      setIsStreaming(true);
      try {
        const ensured = await ensureThreadForSend(threadId);
        const activeThreadId = ensured.threadId;

        if (ensured.createdNewThread) {
          setThreadId(activeThreadId);
        }

        const userMessage = await persistChatMessage({
          threadId: activeThreadId,
          role: "user",
          payload: { kind: "user-text", text },
        });

        const plannerInput = await buildChatTurnInput({
          threadId: activeThreadId,
          text,
        });

        const plan = await requestChatOrchestratorPlan(plannerInput);

        return {
          threadId: activeThreadId,
          userMessageId: userMessage.id,
          plan,
        };
      } finally {
        setIsStreaming(false);
      }
    },
    [isStreaming, setThreadId, threadId],
  );

  return { sendMessage, isStreaming };
};
