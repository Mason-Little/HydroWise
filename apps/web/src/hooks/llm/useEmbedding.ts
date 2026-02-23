import { generateEmbeddings } from "@hydrowise/llm-client";

export const useEmbedding = () => {
  const generateEmbedding = (text: string) => {
    return generateEmbeddings([text]);
  };

  return { generateEmbedding };
};
