import type {
  Chapter,
  Course,
  QuizQuestion,
  QuizSkeletonInput,
} from "@hydrowise/entities";
import {
  generateQuizGeneration,
  generateQuizPlan,
} from "@hydrowise/llm-client";
import { useTopicQueries } from "../query/topic.queries";

export const useQuiz = () => {
  const { retrieveTopicEmbeddings, retrieveTopics } = useTopicQueries();
  const questionOrder: Record<QuizQuestion["type"], number> = {
    bool: 0,
    multipleChoice: 1,
    shortAnswer: 2,
  };

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

    const quizSkeleton = await generateQuizPlan(payload);
    console.log("quiz skeleton output", quizSkeleton);

    const allTopics = inputSchema.flatMap((chapter) => chapter.topics);
    const normalize = (value: string) => value.trim().toLowerCase();

    const generateQuizInput = await Promise.all(
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

        const embeddings = await retrieveTopicEmbeddings(matchedTopic.id);
        const topicChunks = embeddings.map((embedding) => embedding.content);

        return {
          ...topic,
          topicChunks,
          questions: {
            ...topic.questions,
          },
        };
      }),
    );

    console.log("generate quiz input", generateQuizInput);

    const quizChunks = generateQuizInput.map((topic) => {
      return generateQuizGeneration(topic);
    });

    const quiz = await Promise.all(quizChunks);
    return quiz
      .flat()
      .sort((a, b) => questionOrder[a.type] - questionOrder[b.type]);
  };

  return { createQuiz };
};
