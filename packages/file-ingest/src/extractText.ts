import type { InputFormat } from "@matbee/libreoffice-converter/browser";
import { getDocument } from "pdfjs-dist";
import { getFileExtension } from "@/classify";
import { getConverter } from "@/init";

async function fileToPdf(
  file: File,
  ext: string,
): Promise<ArrayBuffer | Uint8Array> {
  if (ext === "pdf") return file.arrayBuffer();
  const result = await getConverter().convertFile(file, {
    inputFormat: ext as InputFormat,
    outputFormat: "pdf",
  });
  return result.data;
}

export async function extractTextPages(file: File): Promise<string[]> {
  const ext = getFileExtension(file);
  const pdf = await getDocument({ data: await fileToPdf(file, ext) }).promise;

  return Promise.all(
    Array.from({ length: pdf.numPages }, async (_, i) => {
      const page = await pdf.getPage(i + 1);
      const content = await page.getTextContent();
      return content.items
        .filter((item) => "str" in item)
        .map((item) => (item as { str: string }).str)
        .join(" ");
    }),
  );
}
