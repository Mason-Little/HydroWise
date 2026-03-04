import { embedMany } from "ai";
import { getEmbeddingModel } from "../../../init/embedding";

export const generateEmbeddings = async (
  values: string[],
): Promise<number[][]> => {
  const model = await getEmbeddingModel();
  const result = await embedMany({
    model,
    values,
  });

  return result.embeddings;
};
