import { useModel } from "@/hooks/llm/useModel";
import { useDocument } from "@/hooks/query/embedding.queries";
import { useMessages } from "@/hooks/query/message.queries";
import { contextToInjection } from "@/lib/prompt/convertContext";
import { convertTextToMessage } from "@/lib/prompt/text-to-message";
import { useChatExists } from "@/lib/query/chat-exists";
import { useChatStore } from "@/store/chatStore";
import { useChat } from "../query/chat.queries";

export const useConversation = () => {
  const { selectedChatId } = useChatStore();
  const { messages } = useMessages();
  const { contextRetrieval } = useDocument();
  const { embedText, generateResponse, isStreaming } = useModel();
  const { sendMessage } = useMessages();
  const { createChat } = useChat();
  const chatExists = useChatExists();

  const handleSendMessage = async (
    prompt: string,
    onmessage: (chunk: string) => void,
  ) => {
    if (!chatExists) {
      await createChat(selectedChatId);
    }

    const promptMessage = convertTextToMessage(prompt, selectedChatId, "user");

    sendMessage(promptMessage);

    const promptEmbedding = await embedText(prompt);
    const retrievedContext = await contextRetrieval(promptEmbedding);
    const contextInjection = contextToInjection(retrievedContext.data);

    const generated = await generateResponse(
      messages,
      promptMessage,
      contextInjection,
      onmessage,
    );

    sendMessage(convertTextToMessage(generated, selectedChatId, "assistant"));
  };

  return { handleSendMessage, isStreaming };
};
