import type { Course, Topic } from "@hydrowise/entities";
import {
  sendSyllabusRouting,
  sendTopicAssignment,
} from "@hydrowise/llm-client";

type TopicSummary = Pick<Topic, "name" | "description">;

export const routeDocument = async (
  chunkConcepts: string[],
  activeCourses: Pick<Course, "id" | "name" | "number">[],
  retrieveTopicsByCourseId: (courseId: string) => Promise<TopicSummary[]>,
) => {
  if (activeCourses.length === 0) {
    return {
      isSyllabus: true,
      courseId: null,
      topicAssessment: null,
    };
  }

  const routing = await sendSyllabusRouting(chunkConcepts, activeCourses);

  if (routing.isSyllabus || !routing.courseId) {
    return {
      ...routing,
      topicAssessment: null,
    };
  }

  const existingTopics = await retrieveTopicsByCourseId(routing.courseId);

  const topicAssessment = await sendTopicAssignment(
    chunkConcepts,
    existingTopics,
  );

  return {
    ...routing,
    topicAssessment,
  };
};
