import {
  classifyFile,
  extractTextPages,
  ingestFile,
} from "@hydrowise/file-ingest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { handleClassify } from "@/features/ingest/upload/helpers/handleClassify";
import { handleDocument } from "@/features/ingest/upload/helpers/handleDocument";
import { handleExtract } from "@/features/ingest/upload/helpers/handleExtract";
import { handlePages } from "@/features/ingest/upload/helpers/handlePage";
import { handleSyllabus } from "@/features/ingest/upload/helpers/handleSyllabus";
import { chapterKeys, courseKeys } from "@/lib/query-keys";
import { useModelStore } from "@/store/modelStore";

export const useUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const { warmVisionModel, coolVisionModel } = useModelStore();
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
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
          return "courses" as const;
        }

        await handleDocument(texts);
        return "chapters" as const;
      }

      if (kind === "office") {
        const textPages = await extractTextPages(file);
        const classification = await handleClassify(textPages);

        if (classification === "syllabus") {
          await handleSyllabus(textPages);
          return "courses" as const;
        }

        const pages = await ingestFile(file);
        const ocrTexts = await handleExtract(
          pages,
          warmVisionModel,
          coolVisionModel,
        );
        const { documentId, abstracts } = await handleDocument(ocrTexts);

        const pageDrafts = ocrTexts.map((ocrText, i) => ({
          blob: pages[i],
          ocrText,
          abstract: abstracts[i] ?? "",
        }));

        await handlePages(documentId, pageDrafts);
        return "chapters" as const;
      }

      throw new Error(`[upload] Unsupported file: ${file.name}`);
    },
    onSuccess: async (scope) => {
      if (scope === "courses") {
        await queryClient.invalidateQueries({ queryKey: courseKeys.all() });
        return;
      }

      await queryClient.invalidateQueries({ queryKey: chapterKeys.all() });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
  };

  const handleSubmit = async () => {
    if (!file || uploadMutation.isPending) return;
    await uploadMutation.mutateAsync(file);
  };

  const clearFile = () => setFile(null);

  return {
    file,
    handleChange,
    handleSubmit,
    clearFile,
    isUploading: uploadMutation.isPending,
  };
};
