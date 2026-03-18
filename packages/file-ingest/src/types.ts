export const OUTPUT_MIME_TYPE = "image/png" as const;
export const IMAGE_MAX_DIMENSION = 1024;
// magic-bytes.js reads up to offset 0x1000 (4096); 4100 adds a small safety margin.
export const FILE_SIGNATURE_BYTE_COUNT = 4100;

export interface NormalizedPage {
  mimeType: typeof OUTPUT_MIME_TYPE;
  base64: string;
  width?: number;
  height?: number;
}

export interface IngestedDocument {
  documentTitle: string;
  fileSizeBytes: number;
  pages: NormalizedPage[];
}

export type SourceKind =
  | "heic-image"
  | "raster-image"
  | "pdf"
  | "office"
  | "unsupported";
