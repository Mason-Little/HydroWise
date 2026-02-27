import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuizStore } from "@/store/quizStore";
import { QuizCard } from "./ui/QuizCard";

export const QuizBox = () => {
  const { currentQuiz } = useQuizStore();

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        {currentQuiz ? <QuizCard questions={currentQuiz} /> : null}
      </CardContent>
    </Card>
  );
};
