import type { Course } from "@hydrowise/entities";
import { sendDocumentRouting } from "@hydrowise/llm-client";

export const routeDocument = async (
  documentName: string,
  chunkConcepts: string[],
  courses: Course[],
) => {
  const documentRoute = await sendDocumentRouting(
    documentName,
    chunkConcepts,
    courses,
  );

  return documentRoute;
};
