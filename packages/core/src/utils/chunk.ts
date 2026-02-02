import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export type ChunkTextOptions = {
  chunkSize?: number;
  chunkOverlap?: number;
  minChunkSize?: number;
};

export const chunkText = async (
  text: string,
  options: ChunkTextOptions = {},
): Promise<string[]> => {
  const trimmed = text
    .split("\n")
    .filter((line) => !/^--\s*\d+\s+of\s+\d+\s*--$/i.test(line.trim()))
    .join("\n")
    .trim();
  if (!trimmed) return [];

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: options.chunkSize ?? 1200,
    chunkOverlap: options.chunkOverlap ?? 240,
  });

  const docs = await splitter.createDocuments([trimmed]);
  const chunks = docs.map((doc) => doc.pageContent.trim()).filter(Boolean);
  if (chunks.length <= 1) return chunks;

  const minChunkSize = options.minChunkSize ?? 40;
  const lastIndex = chunks.length - 1;
  if (chunks[lastIndex].length < minChunkSize) {
    chunks[lastIndex - 1] = `${chunks[lastIndex - 1]}\n${chunks[lastIndex]}`;
    chunks.pop();
  }

  return chunks;
};
