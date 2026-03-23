import { ingestFile } from "@hydrowise/file-ingest";
import { useState } from "react";
import { handleClassify } from "@/features/dashboard/selection/upload/helpers/handleClassify";
import { handleDocument } from "@/features/dashboard/selection/upload/helpers/handleDocument";
import { handleExtract } from "@/features/dashboard/selection/upload/helpers/handleExtract";
import { handleSyllabus } from "@/features/dashboard/selection/upload/helpers/handleSyllabus";

export const useUpload = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);

    const pages = await ingestFile(selected);
    const texts = await handleExtract(pages);

    const classification = await handleClassify(texts);

    if (classification === "syllabus") await handleSyllabus(texts);
    else if (classification === "course") await handleDocument(texts);
    else throw new Error("Unsupported file type");
  };

  return { file, handleChange };
};
