import { embedMany } from "ai";
import { getEmbeddingsModel } from "../init/embeddings";

export const sendWebEmbeddings = async (
  values: string[],
): Promise<number[][]> => {
  const model = getEmbeddingsModel();
  const result = await embedMany({
    model,
    values,
  });

  return result.embeddings;
};
