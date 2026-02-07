import { useModel } from "@/hooks/llm/useModel";
import { useContextRetrieval } from "@/hooks/query/context.queries";
import { useMessages } from "@/hooks/query/message.queries";
import { contextToInjection } from "@/lib/prompt/convertContext";
import { convertTextToMessage } from "@/lib/prompt/text-to-message";
import { useChatStore } from "@/store/chatStore";

export const useConversation = () => {
  const { selectedChatId } = useChatStore();
  const { messages } = useMessages();
  const { contextRetrieval } = useContextRetrieval();
  const { embedText, generateResponse, isStreaming } = useModel();
  const { sendMessage } = useMessages();

  const handleSendMessage = async (
    prompt: string,
    onmessage: (chunk: string) => void,
  ) => {
    const promptMessage = convertTextToMessage(
      prompt,
      selectedChatId || "",
      "user",
    );

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

    sendMessage(
      convertTextToMessage(generated, selectedChatId || "", "assistant"),
    );
  };

  return { handleSendMessage, isStreaming };
};
