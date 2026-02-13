import type { Chapter, Course, QuizSkeletonInput } from "@hydrowise/entities";
import { sendQuizSkeleton } from "@hydrowise/llm-client";
import { useTopicQueries } from "../query/topic.queries";

export const useQuiz = () => {
  const { retrieveTopicEmbeddings, retrieveTopics } = useTopicQueries();

  const createQuiz = async (
    selectedCourse: Course,
    selectedChapters: Chapter[],
  ) => {
    if (!selectedCourse) return;
    const promises = selectedChapters.map(async (chapter) => {
      const topics = await retrieveTopics({
        courseId: selectedCourse.id,
        chapterId: chapter.id,
      });

      return {
        selectedCourse: selectedCourse.name,
        selectedChapter: chapter.name,
        topics,
      };
    });

    const inputSchema = await Promise.all(promises);

    const payload: QuizSkeletonInput = inputSchema.map((chapter) => ({
      selectedCourse: chapter.selectedCourse,
      selectedChapter: chapter.selectedChapter,
      topics: chapter.topics.map((topic) => ({
        name: topic.name,
        description: topic.description,
      })),
    }));

    const quizSkeleton = await sendQuizSkeleton(payload);
    console.log("quiz skeleton output", quizSkeleton);

    const allTopics = inputSchema.flatMap((chapter) => chapter.topics);
    const normalize = (value: string) => value.trim().toLowerCase();

    const embeddings = await Promise.all(
      quizSkeleton.topics.map(async (topic) => {
        const exactMatch = allTopics.find(
          (candidate) => normalize(candidate.name) === normalize(topic.name),
        );

        const partialMatch = allTopics.find(
          (candidate) =>
            normalize(candidate.name).includes(normalize(topic.name)) ||
            normalize(topic.name).includes(normalize(candidate.name)),
        );

        const matchedTopic = exactMatch ?? partialMatch;

        if (!matchedTopic) {
          throw new Error(
            `Could not map quiz topic to source topic: ${topic.name}`,
          );
        }

        return retrieveTopicEmbeddings(matchedTopic.id);
      }),
    );
    console.log("embeddings", embeddings);

    return quizSkeleton;
  };

  return { createQuiz };
};
