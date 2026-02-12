import type { Chapter, Course } from "@hydrowise/entities";
import { useState } from "react";
import { useDocumentEnrichment } from "@/hooks/llm/useDocumentEnrichment";
import { useDocument } from "@/hooks/query/document.queries";
import { useEmbeddingQueries } from "@/hooks/query/embedding.queries";

type UploadDocumentInput = {
  file: File;
  fileName?: string;
  course: Course | null;
  chapter: Chapter | null;
  onDocumentPersisted?: () => void;
};

export const useDocumentUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const { uploadDocument } = useDocument();
  const { createEmbeddingChunk } = useEmbeddingQueries();
  const { enrichDocumentChunks } = useDocumentEnrichment();

  const uploadFileWithEmbeddings = async ({
    file,
    fileName,
    course,
    chapter,
    onDocumentPersisted,
  }: UploadDocumentInput) => {
    if (isUploading) {
      return;
    }

    setIsUploading(true);

    try {
      const document = await uploadDocument({
        name: fileName || file.name,
        size: file.size,
        mimeType: file.type,
        courseId: course?.id ?? null,
        chapterId: chapter?.id ?? null,
      });

      onDocumentPersisted?.();

      const chunks = await enrichDocumentChunks(
        file,
        document.name,
        course,
        chapter,
      );

      await Promise.all(
        chunks.map((chunk) => {
          return createEmbeddingChunk({
            documentId: document.id,
            content: chunk.content,
            embedding: chunk.embedding,
            topicId: chunk.topicId,
            chunkIndex: chunk.chunkIndex,
            chunkIdea: chunk.chunkIdea,
          });
        }),
      );

      console.log("Document uploaded successfully");
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFileWithEmbeddings, isUploading };
};
