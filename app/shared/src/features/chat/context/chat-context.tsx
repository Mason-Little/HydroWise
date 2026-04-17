import type { ChatMessage } from "@hydrowise/entities";
import { createContext, type ReactNode, useContext } from "react";
import { useChatMessages } from "@/domains/chat/hooks/useChatMessages";
import { useSendChatMessage } from "@/features/chat/hooks/use-send-chat-message";
import { useThreadStore } from "@/store/threadStore";

export type ChatContextValue = {
  threadId: string | null;
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  sendMessage: (message: string) => void;
  selectThread: (threadId: string | null) => void;
};

export const ChatContext = createContext<ChatContextValue | null>(null);

type ChatProviderProps = {
  children: ReactNode;
};

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const { activeThreadId, setActiveThread } = useThreadStore();
  const { messages, isLoading } = useChatMessages(activeThreadId);
  const { sendMessage, isStreaming } = useSendChatMessage();

  return (
    <ChatContext.Provider
      value={{
        threadId: activeThreadId,
        messages,
        isLoading,
        isStreaming,
        sendMessage,
        selectThread: setActiveThread,
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
