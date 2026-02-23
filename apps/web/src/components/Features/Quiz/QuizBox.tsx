import type { QuizQuestion } from "@hydrowise/entities";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateQuizDialog } from "./ui/CreateQuizDialog";
import { QuizCard } from "./ui/QuizCard";

export const QuizBox = () => {
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion[] | null>(null);
  const [createQuizOpen, setCreateQuizOpen] = useState(false);

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Quiz</CardTitle>
      </CardHeader>
      <CreateQuizDialog
        open={createQuizOpen}
        onOpenChange={setCreateQuizOpen}
        onQuizCreated={setCurrentQuiz}
      />
      <CardContent>
        {currentQuiz ? (
          <QuizCard questions={currentQuiz} />
        ) : (
          <Button onClick={() => setCreateQuizOpen(true)}>Create Quiz</Button>
        )}
      </CardContent>
    </Card>
  );
};
