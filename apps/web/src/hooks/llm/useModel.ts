import type { ChatMessage } from "@hydrowise/entities";
import { generateGroundedResponse } from "@hydrowise/llm-client";
import { useState } from "react";

export const useModel = () => {
  const [isStreaming, setIsStreaming] = useState(false);

  const generateResponse = async (
    query: ChatMessage,
    history: ChatMessage[],
    contextInjection: string,
    onmessage: (chunk: string) => void,
  ) => {
    setIsStreaming(true);
    const fullResponse = await generateGroundedResponse(
      query,
      history,
      contextInjection,
      onmessage,
    );
    setIsStreaming(false);
    return fullResponse;
  };

  return { generateResponse, isStreaming };
};
