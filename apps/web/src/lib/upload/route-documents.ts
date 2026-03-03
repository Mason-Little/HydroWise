import type { ChunkConceptResult, Course, Topic } from "@hydrowise/entities";
import { routeDocument } from "./route-document";

type TopicSummary = Pick<Topic, "name" | "description">;

export const routeDocuments = async (
  allChunkConcepts: ChunkConceptResult[][],
  courses: Course[],
  retrieveTopicsByCourseId: (courseId: string) => Promise<TopicSummary[]>,
) => {
  const activeCourses = courses
    .filter((course) => course.status === "active")
    .map(({ id, name, number }) => ({ id, name, number }));

  const topicsByCourseId = new Map<string, Promise<TopicSummary[]>>();

  return Promise.all(
    allChunkConcepts.map((documentChunkConcepts) =>
      routeDocument(
        documentChunkConcepts.map(({ idea }) => idea),
        activeCourses,
        (courseId) => {
          const cached = topicsByCourseId.get(courseId);
          if (cached) return cached;

          const request = retrieveTopicsByCourseId(courseId).then((topics) =>
            topics.map(({ name, description }) => ({ name, description })),
          );

          topicsByCourseId.set(courseId, request);
          return request;
        },
      ),
    ),
  );
};
