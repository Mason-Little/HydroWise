import type { DocumentMeta } from "@hydrowise/entities";
import { chunkText } from "../utils/chunk";
import { parseDocx } from "./docx/parse-docx";
import { generateEmbeddings } from "./embeddings";
import { parseImage } from "./image/parse-image";
import { parsePdf } from "./pdf/parse-pdf";
import { parsePptx } from "./pptx/parse-pptx";

type ParsedDocument = {
  text: string;
  pageCount?: number | null;
};

type Parser = (file: File) => Promise<ParsedDocument>;

const IMAGE_FILE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "heic",
  "heif",
  "gif",
  "bmp",
  "tif",
  "tiff",
  "avif",
]);

const parsersByMimeType: Record<string, Parser> = {
  "application/pdf": parsePdf,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    parseDocx,
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    parsePptx,
};

const hasKnownImageExtension = (filename: string) => {
  const extension = filename.split(".").pop()?.toLowerCase();
  return !!extension && IMAGE_FILE_EXTENSIONS.has(extension);
};

const getParserForFile = (file: File): Parser | undefined => {
  const parser = parsersByMimeType[file.type];
  if (parser) return parser;

  if (file.type.toLowerCase().startsWith("image/")) {
    return parseImage;
  }

  if (!file.type && hasKnownImageExtension(file.name)) {
    return parseImage;
  }

  return undefined;
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
  const parser = getParserForFile(file);
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
