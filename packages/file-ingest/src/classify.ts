type FileKind = "raster" | "office" | "unsupported";

const RASTER_EXTS = new Set(["jpg", "jpeg", "png", "heic", "heif"]);
const OFFICE_EXTS = new Set(["pdf", "doc", "docx", "ppt", "pptx"]);

export function getFileExtension(file: File): string {
  return file.name.split(".").pop()?.toLowerCase() ?? "";
}

export function classifyFile(file: File): FileKind {
  const ext = getFileExtension(file);
  if (RASTER_EXTS.has(ext)) return "raster";
  if (OFFICE_EXTS.has(ext)) return "office";
  return "unsupported";
}
