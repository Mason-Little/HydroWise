import { classifyFile } from "@/classify";
import { officeToPngPages } from "@/handlers/office";
import { rasterToPngPages } from "@/handlers/raster";

export async function ingestFile(file: File): Promise<Blob[]> {
  const kind = classifyFile(file);
  switch (kind) {
    case "raster":
      return rasterToPngPages(file);
    case "office":
      return officeToPngPages(file);
    default:
      throw new Error(`[file-ingest] Unsupported file: ${file.name}`);
  }
}
