import {
  classifyFile,
  extractTextPages,
  ingestFile,
} from "@hydrowise/file-ingest";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { handleClassify } from "@/features/dashboard/selection/upload/helpers/handleClassify";
import { handleDocument } from "@/features/dashboard/selection/upload/helpers/handleDocument";
import { handleExtract } from "@/features/dashboard/selection/upload/helpers/handleExtract";
import { handlePages } from "@/features/dashboard/selection/upload/helpers/handlePage";
import { handleSyllabus } from "@/features/dashboard/selection/upload/helpers/handleSyllabus";
import { useModelStore } from "@/store/modelStore";

export const useUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const { warmVisionModel, coolVisionModel } = useModelStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
  };

  const handleSubmit = async () => {
    if (!file) return;

    const kind = classifyFile(file);

    if (kind === "raster") {
      const pages = await ingestFile(file);
      const texts = await handleExtract(
        pages,
        warmVisionModel,
        coolVisionModel,
      );
      const classification = await handleClassify(texts);
      if (classification === "syllabus") {
        await handleSyllabus(texts);
        queryClient.invalidateQueries({ queryKey: ["courses"] });
      } else {
        await handleDocument(texts);
        queryClient.invalidateQueries({ queryKey: ["chapters"] });
      }
      return;
    }

    if (kind === "office") {
      const textPages = await extractTextPages(file);
      const classification = await handleClassify(textPages);

      if (classification === "syllabus") {
        await handleSyllabus(textPages);
        queryClient.invalidateQueries({ queryKey: ["courses"] });
        return;
      }

      const pages = await ingestFile(file);
      const ocrTexts = await handleExtract(
        pages,
        warmVisionModel,
        coolVisionModel,
      );
      const { documentId, abstracts } = await handleDocument(ocrTexts);
      queryClient.invalidateQueries({ queryKey: ["chapters"] });

      const pageDrafts = ocrTexts.map((ocrText, i) => ({
        blob: pages[i],
        ocrText,
        abstract: abstracts[i] ?? "",
      }));

      await handlePages(documentId, pageDrafts);
      return;
    }

    throw new Error(`[upload] Unsupported file: ${file.name}`);
  };

  const clearFile = () => setFile(null);

  return { file, handleChange, handleSubmit, clearFile };
};
