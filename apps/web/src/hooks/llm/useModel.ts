import type { ConversationMessage } from "@hydrowise/entities";
import { sendChatCompletion, sendEmbedding } from "@hydrowise/llm-client";
import { useState } from "react";

export const useModel = () => {
  const [isStreaming, setIsStreaming] = useState(false);

  const embedText = (query: string) => {
    return sendEmbedding(query);
  };

  const generateResponse = async (
    history: ConversationMessage[],
    query: ConversationMessage,
    contextInjection: string,
    onmessage: (chunk: string) => void,
  ) => {
    setIsStreaming(true);
    const fullResponse = await sendChatCompletion(
      history,
      query,
      contextInjection,
      onmessage,
    );
    setIsStreaming(false);
    return fullResponse;
  };

  return { embedText, generateResponse, isStreaming };
};
