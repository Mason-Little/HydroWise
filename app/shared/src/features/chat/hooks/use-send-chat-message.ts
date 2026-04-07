import type { GroundedAssistantMessagePayload } from "@hydrowise/entities";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { sendChatTurn } from "@/features/chat/helpers/send-chat-turn";
import { useThreadStore } from "@/store/threadStore";

export const useSendChatMessage = (
  setAssistantDraft: (draft: GroundedAssistantMessagePayload | null) => void,
) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const queryClient = useQueryClient();
  const { activeThreadId, setActiveThread } = useThreadStore();

  const sendMessage = useCallback(
    async (text: string) => {
      if (isStreaming) return;

      setIsStreaming(true);
      try {
        const result = await sendChatTurn({
          activeThreadId,
          setActiveThread,
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
    [
      isStreaming,
      queryClient,
      activeThreadId,
      setActiveThread,
      setAssistantDraft,
    ],
  );

  return { sendMessage, isStreaming };
};
