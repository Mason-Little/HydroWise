import type { ChatMessage } from "@hydrowise/entities";
import { createContext, type ReactNode, useContext } from "react";
import { useChatMessages } from "@/domains/chat/hooks/useChatMessages";
import { useSendChatMessage } from "@/features/chat/hooks/use-send-chat-message";
import { type ThreadSession, useThreadStore } from "@/store/threadStore";

export type ChatContextValue = {
  session: ThreadSession;
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  sendMessage: (message: string) => void;
  activateThread: (threadId: string) => void;
  clearThread: () => void;
};

export const ChatContext = createContext<ChatContextValue | null>(null);

type ChatProviderProps = {
  children: ReactNode;
};

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const { session, activateThread, clearThread } = useThreadStore();
  const { messages, isLoading } = useChatMessages(session);
  const { sendMessage, isStreaming } = useSendChatMessage();

  return (
    <ChatContext.Provider
      value={{
        session,
        messages,
        isLoading,
        isStreaming,
        sendMessage,
        activateThread,
        clearThread,
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
