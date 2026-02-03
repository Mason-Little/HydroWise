import { PDFParse } from "pdf-parse";

PDFParse.setWorker(
  "https://cdn.jsdelivr.net/npm/pdf-parse@latest/dist/pdf-parse/web/pdf.worker.mjs",
);

export const parsePdf = async (file: File) => {
  const parser = new PDFParse({ data: await file.arrayBuffer() });
  const result = await parser.getText();
  await parser.destroy();

  const parsed = result as unknown as { text?: string; numpages?: number };
  const pageCount =
    typeof parsed.numpages === "number" ? parsed.numpages : null;

  const text = (parsed.text ?? "").replace(/\f/g, "\n\n---\n\n");

  return {
    text,
    pageCount,
  };
};
