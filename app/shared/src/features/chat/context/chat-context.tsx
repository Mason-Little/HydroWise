import type { GroundedAssistantMessagePayload } from "@hydrowise/entities";
import { createContext, type ReactNode, useContext, useState } from "react";
import { useSendChatMessage } from "@/features/chat/hooks/use-send-chat-message";

export type ChatContextValue = {
  threadId: string | null;
  selectThread: (threadId: string | null) => void;
  isStreaming: boolean;
  sendMessage: (message: string) => Promise<unknown>;
  assistantDraft: GroundedAssistantMessagePayload | null;
  setAssistantDraft: (draft: GroundedAssistantMessagePayload | null) => void;
};

export const ChatContext = createContext<ChatContextValue | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [threadId, setThreadId] = useState<string | null>(null);
  const [assistantDraft, setAssistantDraft] =
    useState<GroundedAssistantMessagePayload | null>(null);

  const { sendMessage, isStreaming } = useSendChatMessage(
    threadId,
    setThreadId,
    setAssistantDraft,
  );

  return (
    <ChatContext.Provider
      value={{
        threadId,
        selectThread: setThreadId,
        isStreaming,
        sendMessage,
        assistantDraft,
        setAssistantDraft,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = (): ChatContextValue => {
  const value = useContext(ChatContext);
  if (!value) {
    throw new Error("useChatContext must be used within a ChatProvider.");
  }
  return value;
};
