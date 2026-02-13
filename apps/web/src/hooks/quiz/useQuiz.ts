import type { QuizSkeletonInput, Topic } from "@hydrowise/entities";
import { sendQuizSkeleton } from "@hydrowise/llm-client";

export const useQuiz = () => {
  const createQuiz = async (
    inputSchema: {
      selectedCourse: string;
      selectedChapter: string;
      topics: Topic[];
    }[],
  ) => {
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
    return quizSkeleton;
  };

  return { createQuiz };
};
