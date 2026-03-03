import { Header } from "@/components/Features/Dashboard/CourseContext/Quizzes/Header/Header";
import { QuizzesAttempts } from "@/components/Features/Dashboard/CourseContext/Quizzes/Quizzes/QuizHistoryContainer";

export const QuizzesContainer = () => {
  return (
    <div className="flex w-full flex-col gap-4">
      <h2 className="text-sm font-semibold">Quiz History</h2>
      <Header />
      <QuizzesAttempts />
    </div>
  );
};
