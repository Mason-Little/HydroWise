import { useCallback, useState } from "react";

import { sendChatTurn } from "@/features/chat/helpers/send-chat-turn";

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
        return await sendChatTurn({
          threadId,
          setThreadId,
          text,
        });
      } finally {
        setIsStreaming(false);
      }
    },
    [isStreaming, setThreadId, threadId],
  );

  return { sendMessage, isStreaming };
};
