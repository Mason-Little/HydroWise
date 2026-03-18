import { filetypeinfo } from "magic-bytes.js";
import { FILE_SIGNATURE_BYTE_COUNT, type SourceKind } from "../types";
import { getFileExtension } from "../utils";

const CLASSIFIERS: Array<[SourceKind, Set<string>, Set<string>]> = [
  [
    "heic-image",
    new Set(["image/heic", "image/heif"]),
    new Set(["heic", "heif", "hif"]),
  ],
  ["pdf", new Set(["application/pdf"]), new Set(["pdf"])],
  [
    "raster-image",
    new Set(["image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp", "image/tiff", "image/avif"]),
    new Set(["jpg", "jpeg", "png", "gif", "webp", "bmp", "tif", "tiff", "avif"]),
  ],
  [
    "office",
    new Set([
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.oasis.opendocument.text",
      "application/vnd.oasis.opendocument.spreadsheet",
      "application/vnd.oasis.opendocument.presentation",
      "application/rtf",
      "text/rtf",
    ]),
    new Set(["doc", "docx", "xls", "xlsx", "ppt", "pptx", "odt", "ods", "odp", "rtf"]),
  ],
];

export async function classifyFile(file: File): Promise<SourceKind> {
  const buffer = await file.slice(0, FILE_SIGNATURE_BYTE_COUNT).arrayBuffer();
  const sniffed = filetypeinfo(new Uint8Array(buffer));
  const mime = file.type.toLowerCase();
  const ext = getFileExtension(file);

  for (const [kind, mimes, exts] of CLASSIFIERS) {
    if (
      sniffed.some((m) => (m.mime && mimes.has(m.mime)) || (m.extension && exts.has(m.extension))) ||
      mimes.has(mime) ||
      exts.has(ext)
    ) {
      return kind;
    }
  }

  return "unsupported";
}
