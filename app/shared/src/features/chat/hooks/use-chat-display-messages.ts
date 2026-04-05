import type {
  ChatMessage,
  GroundedAssistantMessagePayload,
} from "@hydrowise/entities";
import { useMemo } from "react";
import { useChatMessages } from "@/features/chat/hooks/use-chat-messages";

const STREAMING_ASSISTANT_MESSAGE_ID = "streaming-assistant";

export const useChatDisplayMessages = (
  threadId: string | null,
  assistantDraft: GroundedAssistantMessagePayload | null,
) => {
  const { messages, isLoading } = useChatMessages(threadId);

  const displayMessages = useMemo((): ChatMessage[] => {
    if (threadId === null || assistantDraft === null) {
      return messages;
    }
    return [
      ...messages,
      {
        id: STREAMING_ASSISTANT_MESSAGE_ID,
        threadId,
        role: "assistant",
        payload: assistantDraft,
      } satisfies ChatMessage,
    ];
  }, [assistantDraft, messages, threadId]);

  return { messages: displayMessages, isLoading };
};
