import { classifyFile } from "@/classify";
import { heicFileToNormalizedPage } from "@/handlers/heic";
import { libreofficeFileToNormalizedPages } from "@/handlers/libreoffice";
import { rasterFileToNormalizedPage } from "@/handlers/raster";
import type { IngestedDocument, NormalizedPage } from "@/types";

export async function ingestFile(file: File): Promise<IngestedDocument> {
  const kind = await classifyFile(file);
  let pages: NormalizedPage[];

  switch (kind) {
    case "heic-image":
      pages = [await heicFileToNormalizedPage(file)];
      break;
    case "raster-image":
      pages = [await rasterFileToNormalizedPage(file)];
      break;
    case "pdf":
    case "office":
      pages = await libreofficeFileToNormalizedPages(file);
      break;
    default:
      throw new Error(`[file-ingest] Unsupported file: ${file.name} (${file.type})`);
  }

  return { documentTitle: file.name, fileSizeBytes: file.size, pages };
}
