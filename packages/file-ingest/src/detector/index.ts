export type FileKind = "image" | "pdf" | "document" | "unsupported";

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/avif",
  "image/bmp",
  "image/tiff",
]);

const DOCUMENT_TYPES = new Set([
  // Word
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // Excel
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  // PowerPoint
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  // OpenDocument
  "application/vnd.oasis.opendocument.text",
  "application/vnd.oasis.opendocument.spreadsheet",
  "application/vnd.oasis.opendocument.presentation",
  // RTF
  "application/rtf",
  "text/rtf",
]);

// Extension fallbacks for when the browser reports a generic MIME type.
const DOCUMENT_EXTENSIONS = new Set([
  "doc", "docx",
  "xls", "xlsx",
  "ppt", "pptx",
  "odt", "ods", "odp",
  "rtf",
]);

const IMAGE_EXTENSIONS = new Set([
  "jpg", "jpeg", "png", "gif", "webp", "svg", "avif", "bmp", "tiff", "tif",
]);

function extension(file: File): string {
  return file.name.split(".").pop()?.toLowerCase() ?? "";
}

export function detectFileKind(file: File): FileKind {
  const mime = file.type.toLowerCase();
  const ext = extension(file);

  if (mime === "application/pdf" || ext === "pdf") return "pdf";
  if (IMAGE_TYPES.has(mime) || IMAGE_EXTENSIONS.has(ext)) return "image";
  if (DOCUMENT_TYPES.has(mime) || DOCUMENT_EXTENSIONS.has(ext)) return "document";

  return "unsupported";
}
