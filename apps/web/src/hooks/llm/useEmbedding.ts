import { parseDocument } from "@hydrowise/core";
import { sendEmbedding } from "@hydrowise/llm-client";

export const useEmbedding = () => {
  const generateEmbedding = (text: string) => {
    return sendEmbedding(text);
  };

  const generateDocumentEmbeddings = (file: File) => {
    return parseDocument(file);
  };

  return { generateEmbedding, generateDocumentEmbeddings };
};
