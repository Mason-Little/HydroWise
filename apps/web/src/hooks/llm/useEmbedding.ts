import { sendEmbedding } from "@hydrowise/llm-client";

export const useEmbedding = () => {
  const generateEmbedding = (text: string) => {
    return sendEmbedding(text);
  };

  return { generateEmbedding };
};
