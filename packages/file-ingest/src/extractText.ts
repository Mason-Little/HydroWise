import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import { getFileExtension } from "@/classify";
import { fileToPdf } from "@/handlers/office";

GlobalWorkerOptions.workerSrc = "/assets/pdf.worker.mjs";

async function pdfToTextPages(
  pdfData: Uint8Array | ArrayBuffer,
): Promise<string[]> {
  const pdf = await getDocument({ data: pdfData }).promise;

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

export async function extractTextPages(file: File): Promise<string[]> {
  return pdfToTextPages(await fileToPdf(file, getFileExtension(file)));
}
