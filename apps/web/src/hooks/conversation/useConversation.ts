import { useEmbedding } from "@/hooks/llm/useEmbedding";
import { useModel } from "@/hooks/llm/useModel";
import { useEmbeddingQueries } from "@/hooks/query/embedding.queries";
import { useMessages } from "@/hooks/query/message.queries";
import { contextToInjection } from "@/lib/prompt/convertContext";
import { convertTextToMessage } from "@/lib/prompt/text-to-message";
import { useChatStore } from "@/store/chatStore";
import { useChat } from "../query/chat.queries";

export const useConversation = () => {
  const { selectedChatId, setSelectedChatId } = useChatStore();
  const { messages } = useMessages();
  const { contextRetrieval } = useEmbeddingQueries();
  const { generateEmbedding } = useEmbedding();
  const { generateResponse, isStreaming } = useModel();
  const { sendMessage } = useMessages();
  const { createChat } = useChat();

  const ensureActiveChat = async () => {
    if (selectedChatId) {
      return selectedChatId;
    }

    const createdChat = await createChat();
    const chatId = createdChat.id;
    setSelectedChatId(chatId);
    return chatId;
  };

  const handleSendMessage = async (
    prompt: string,
    onmessage: (chunk: string) => void,
  ) => {
    const chatId = await ensureActiveChat();

    const promptMessage = convertTextToMessage(prompt, "user");

    await sendMessage(chatId, promptMessage);

    const promptEmbedding = await generateEmbedding(prompt);
    const retrievedContext = await contextRetrieval(promptEmbedding);
    const contextInjection = contextToInjection(retrievedContext);

    const generated = await generateResponse(
      promptMessage,
      messages,
      contextInjection,
      onmessage,
    );

    await sendMessage(chatId, convertTextToMessage(generated, "assistant"));
  };

  return { handleSendMessage, isStreaming };
};
