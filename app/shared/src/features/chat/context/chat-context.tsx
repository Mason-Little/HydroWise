import { createContext, type ReactNode, useContext } from "react";
import { useSendChatMessage } from "@/features/chat/hooks/use-send-chat-message";

export type ChatContextValue = {
  isStreaming: boolean;
  sendMessage: (message: string) => void;
};

export const ChatContext = createContext<ChatContextValue | null>(null);

type ChatProviderProps = {
  children: ReactNode;
};

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const { sendMessage, isStreaming } = useSendChatMessage();

  return (
    <ChatContext.Provider
      value={{
        isStreaming,
        sendMessage,
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
