import { encode } from "uint8-to-base64";
import { getConverter } from "../init";
import { IMAGE_MAX_DIMENSION, type NormalizedPage, OUTPUT_MIME_TYPE } from "../types";
import { getFileExtension } from "../utils";

const INPUT_FORMATS = [
  "doc", "docx", "xls", "xlsx", "ppt", "pptx",
  "odt", "ods", "odp", "odg", "odf",
  "rtf", "txt", "html", "htm", "csv", "xml", "epub", "pdf",
] as const;

type LibreOfficeInputFormat = typeof INPUT_FORMATS[number];

const INPUT_FORMAT_SET = new Set<string>(INPUT_FORMATS);

function getInputFormat(file: File): LibreOfficeInputFormat {
  const ext = getFileExtension(file);
  if (INPUT_FORMAT_SET.has(ext)) return ext as LibreOfficeInputFormat;
  if (file.type === "application/pdf") return "pdf";
  throw new Error(`[file-ingest] Could not determine LibreOffice input format: ${file.name}`);
}

export async function libreofficeFileToNormalizedPages(
  file: File,
): Promise<NormalizedPage[]> {
  const inputFormat = getInputFormat(file);
  const input = new Uint8Array(await file.arrayBuffer());
  const converter = getConverter();
  const pageCount = await converter.getPageCount(input, { inputFormat });
  const pages: NormalizedPage[] = [];

  for (let i = 0; i < pageCount; i++) {
    const preview = await converter.renderPageViaConvert(input, { inputFormat }, i, IMAGE_MAX_DIMENSION);
    pages.push({
      mimeType: OUTPUT_MIME_TYPE,
      base64: encode(preview.data),
      width: preview.width,
      height: preview.height,
    });
  }

  return pages;
}
