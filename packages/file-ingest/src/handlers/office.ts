import { unzipSync } from "fflate";
import { encode } from "uint8-to-base64";
import { getConverter } from "@/init";

export async function officeToPngPages(file: File): Promise<string[]> {
  const converter = getConverter();
  const result = await converter.convertFile(file, { outputFormat: "png" });

  if (result.mimeType === "application/zip") {
    const entries = unzipSync(result.data);
    return Object.keys(entries)
      .sort()
      .map((name) => encode(entries[name]));
  }

  return [encode(result.data)];
}
