import type { QuizQuestion } from "@hydrowise/entities";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { quizQuestions } from "./quizData";
import { CreateQuizDialog } from "./ui/CreateQuizDialog";
import { QuizCard } from "./ui/QuizCard";

export const QuizBox = () => {
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion[] | null>(null);
  const [createQuizOpen, setCreateQuizOpen] = useState(false);

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Quiz</CardTitle>
        <div className="flex gap-2">
          <Button onClick={() => setCreateQuizOpen(true)}>Create Quiz</Button>
          <Button>Quiz History</Button>
        </div>
      </CardHeader>
      <CreateQuizDialog
        open={createQuizOpen}
        onOpenChange={setCreateQuizOpen}
      />
      <CardContent>
        {currentQuiz ? (
          <QuizCard questions={currentQuiz} />
        ) : (
          <Button onClick={() => setCurrentQuiz(quizQuestions)}>
            Create Quiz to get started
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
