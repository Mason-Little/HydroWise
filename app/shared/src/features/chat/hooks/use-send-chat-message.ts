import type { GroundedAssistantMessagePayload } from "@hydrowise/entities";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { sendChatTurn } from "@/features/chat/helpers/send-chat-turn";

export const useSendChatMessage = (
  threadId: string | null,
  setThreadId: (id: string | null) => void,
  setAssistantDraft: (draft: GroundedAssistantMessagePayload | null) => void,
) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const queryClient = useQueryClient();

  const sendMessage = useCallback(
    async (text: string) => {
      if (isStreaming) return;

      setIsStreaming(true);
      try {
        const result = await sendChatTurn({
          threadId,
          setThreadId,
          text,
          setAssistantDraft,
        });
        await queryClient.invalidateQueries({
          queryKey: ["chatMessages", result.threadId],
        });
        return result;
      } finally {
        setIsStreaming(false);
      }
    },
    [isStreaming, queryClient, setThreadId, threadId, setAssistantDraft],
  );

  return { sendMessage, isStreaming };
};
