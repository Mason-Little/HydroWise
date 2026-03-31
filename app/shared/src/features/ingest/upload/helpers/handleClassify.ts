import { classify } from "@hydrowise/ai-runtime";

export const handleClassify = async (texts: string[]) => {
  const firstChunks = texts.slice(0, 2).join("\n---\n");
  const { classification } = await classify(firstChunks);
  return classification;
};
