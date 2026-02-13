import type { Topic } from "@hydrowise/entities";

export const useQuiz = () => {
  const createQuiz = async (
    inputSchema: {
      selectedCourse: string;
      selectedChapter: string;
      topics: Topic[];
    }[],
  ) => {
    console.log(
      "this will be the input to the skeleton.",
      inputSchema.map((chapter) => chapter.selectedChapter),
      inputSchema.map((chapter) => chapter.topics),
    );
  };

  return { createQuiz };
};
