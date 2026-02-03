import type { DocumentMeta } from "@hydrowise/entities";
import { chunkText } from "../utils/chunk";
import { parseDocx } from "./docx/parse-docx";
import { generateEmbeddings } from "./embeddings";
import { parsePdf } from "./pdf/parse-pdf";
import { parsePptx } from "./pptx/parse-pptx";

type ParsedDocument = {
  text: string;
  pageCount?: number | null;
};

type Parser = (file: File) => Promise<ParsedDocument>;

const parsersByMimeType: Record<string, Parser> = {
  "application/pdf": parsePdf,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    parseDocx,
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    parsePptx,
};

export const parseDocumentMeta = async (
  file: File,
  options: {
    onProgress?: (completed: number, total: number) => void;
    chunkOptions?: {
      chunkSize?: number;
      chunkOverlap?: number;
    };
  } = {},
): Promise<DocumentMeta> => {
  const parser = parsersByMimeType[file.type];
  if (!parser) {
    throw new Error(
      `Unsupported file type: ${file.type}. ` + `File: ${file.name}`,
    );
  }

  const parsedDocument = await parser(file);
  const chunks = await chunkText(parsedDocument.text, options.chunkOptions);
  const embeddings = await generateEmbeddings(chunks, options.onProgress);

  return {
    name: file.name,
    mimeType: file.type,
    fileSize: file.size,
    pageCount: parsedDocument.pageCount ?? null,
    embeddings,
  };
};
