import { sendDocumentAssignment } from "@hydrowise/llm-client";
import { useChapters } from "@/hooks/query/chapter.queries";
import { useTopicQueries } from "@/hooks/query/topic.queries";

export const uploadCourseDocument = async (
  file: File,
  fileChunks: string[],
  courseId: string,
) => {
  const { chapters } = useChapters(courseId);
  const { retrieveTopics } = useTopicQueries();

  const topics = await retrieveTopics({ courseId });

  const documentAssignment = await sendDocumentAssignment(
    fileChunks,
    topics,
    chapters,
  );

  console.log("Document assignment:", documentAssignment);
};
