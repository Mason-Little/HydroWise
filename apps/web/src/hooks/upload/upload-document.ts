import type { Course } from "@hydrowise/entities";
import { chunkText } from "@/lib/chunk/chunk-text";
import { parseDocument } from "@/lib/document/parse";
import { chunkConcepts } from "./chunk-concept";
import { routeDocument } from "./route-document";
import { uploadCourseDocument } from "./upload-course-document";
import { uploadSyllabus } from "./upload-syllabus";

export const uploadDocuments = async (files: File[], courses: Course[]) => {
  files.map((file) => uploadDocument(file, courses));
};

const uploadDocument = async (file: File, courses: Course[]) => {
  const fileText = await parseDocument(file);

  const fileChunks = await chunkText(fileText);

  const allChunkConcepts = await chunkConcepts(fileChunks);

  const documentRoute = await routeDocument(
    file.name,
    allChunkConcepts,
    courses,
  );

  if (documentRoute.isSyllabus) {
    await uploadSyllabus(file, fileText);
  } else {
    await uploadCourseDocument(file, fileChunks, documentRoute.courseId);
  }

  console.log("Uploading file:", documentRoute);
};
