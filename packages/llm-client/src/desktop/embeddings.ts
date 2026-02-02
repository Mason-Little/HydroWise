import { createOpenAI } from "@ai-sdk/openai";
import { embedMany } from "ai";

const getOpenAIClient = () =>
  createOpenAI({
    baseURL: import.meta.env.VITE_DESKTOP_EMBEDDING_ENDPOINT,
    apiKey: "null",
  });

export const getEmbeddings = async (values: string[]): Promise<number[][]> => {
  const openai = getOpenAIClient();
  const result = await embedMany({
    model: openai.embedding("any"),
    values,
  });

  return result.embeddings;
};
