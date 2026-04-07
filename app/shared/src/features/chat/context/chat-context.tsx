import type { GroundedAssistantMessagePayload } from "@hydrowise/entities";
import { createContext, type ReactNode, useContext, useState } from "react";
import { useSendChatMessage } from "@/features/chat/hooks/use-send-chat-message";

export type ChatContextValue = {
  isStreaming: boolean;
  sendMessage: (message: string) => Promise<unknown>;
  assistantDraft: GroundedAssistantMessagePayload | null;
  setAssistantDraft: (draft: GroundedAssistantMessagePayload | null) => void;
};

export const ChatContext = createContext<ChatContextValue | null>(null);

type ChatProviderProps = {
  children: ReactNode;
};

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [assistantDraft, setAssistantDraft] =
    useState<GroundedAssistantMessagePayload | null>(null);

  const { sendMessage, isStreaming } = useSendChatMessage(setAssistantDraft);

  return (
    <ChatContext.Provider
      value={{
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
