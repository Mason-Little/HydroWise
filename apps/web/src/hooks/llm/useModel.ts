import type { ConversationMessage } from "@hydrowise/entities";
import { sendChatCompletion } from "@hydrowise/llm-client";
import { useState } from "react";

export const useModel = () => {
  const [isStreaming, setIsStreaming] = useState(false);

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

  return { generateResponse, isStreaming };
};
