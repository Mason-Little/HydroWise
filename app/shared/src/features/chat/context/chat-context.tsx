import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  type ReactNode,
  useContext,
  useRef,
  useState,
} from "react";
import { ensureThreadForSend } from "@/features/chat/helpers/ensure-thread-for-send";
import {
  chatQueryKeys,
  useCreateUserTextMessageMutation,
} from "@/features/chat/hooks/use-chat-queries";

export type ChatContextValue = {
  threadId: string | null;
  isStreaming: boolean;
  selectThread: (threadId: string | null) => void;
  sendMessage: (message: string) => Promise<void>;
};

export const ChatContext = createContext<ChatContextValue | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const createUserTextMessage = useCreateUserTextMessageMutation();
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const isStreamingRef = useRef(false);

  const sendMessage = async (message: string) => {
    if (isStreamingRef.current) return;
    isStreamingRef.current = true;
    setIsStreaming(true);
    try {
      const ensured = await ensureThreadForSend(threadId);
      if (ensured.createdNewThread) {
        setThreadId(ensured.threadId);
      }
      await createUserTextMessage.mutateAsync({
        threadId: ensured.threadId,
        text: message,
      });
      await queryClient.invalidateQueries({ queryKey: chatQueryKeys.threads });
      await queryClient.invalidateQueries({
        queryKey: chatQueryKeys.messages(ensured.threadId),
      });
    } finally {
      isStreamingRef.current = false;
      setIsStreaming(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{ threadId, isStreaming, selectThread: setThreadId, sendMessage }}
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
