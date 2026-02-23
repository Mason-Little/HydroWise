import { embedMany } from "ai";
import { getEmbeddingModel } from "../../../init/embedding";

export const sendDesktopEmbeddings = async (
  values: string[],
): Promise<number[][]> => {
  const model = getEmbeddingModel();
  const result = await embedMany({
    model,
    values,
  });

  return result.embeddings;
};
