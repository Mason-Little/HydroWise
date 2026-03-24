import {
  classifyFile,
  extractTextPages,
  ingestFile,
} from "@hydrowise/file-ingest";
import { useState } from "react";
import { handleClassify } from "@/features/dashboard/selection/upload/helpers/handleClassify";
import { handleDocument } from "@/features/dashboard/selection/upload/helpers/handleDocument";
import { handleExtract } from "@/features/dashboard/selection/upload/helpers/handleExtract";
import { handleSyllabus } from "@/features/dashboard/selection/upload/helpers/handleSyllabus";
import { handlePages } from "../helpers/handlePage";

export const useUpload = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);

    const kind = classifyFile(selected);

    if (kind === "raster") {
      const pages = await ingestFile(selected);
      const texts = await handleExtract(pages);
      const classification = await handleClassify(texts);
      if (classification === "syllabus") await handleSyllabus(texts);
      else await handleDocument(texts);
      return;
    }

    if (kind === "office") {
      const textPages = await extractTextPages(selected);
      const classification = await handleClassify(textPages);

      if (classification === "syllabus") {
        await handleSyllabus(textPages);
        return;
      }

      const pages = await ingestFile(selected);
      const ocrTexts = await handleExtract(pages);
      const { documentId, abstracts } = await handleDocument(ocrTexts);

      const pageDrafts = ocrTexts.map((ocrText, i) => ({
        blob: pages[i],
        ocrText,
        abstract: abstracts[i] ?? "",
      }));

      await handlePages(documentId, pageDrafts);
    }

    throw new Error(`[upload] Unsupported file: ${selected.name}`);
  };

  return { file, handleChange };
};
