import { sendChatCompletion } from "@hydrowise/llm-client";
import { useEffect } from "react";
import { useChatStore } from "@/store/chatStore";
import { useHistoryStore } from "@/store/historyStore";

export const useChat = () => {
  const { activeChatId, createChat } = useChatStore();
  const { addHistory, getHistory } = useHistoryStore();

  useEffect(() => {
    if (!activeChatId) {
      createChat();
    }
  }, [activeChatId, createChat]);

  const submitMessage = async (prompt: string) => {
    const chatId = activeChatId ?? createChat().id;
    const history = getHistory(chatId);
    const userMessage = addHistory(prompt, "user", chatId);
    const response = await sendChatCompletion(history, userMessage);

    addHistory(response, "assistant", chatId);
  };

  return {
    submitMessage,
  };
};
