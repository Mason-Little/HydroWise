import type { QuizQuestion } from "@hydrowise/entities";
import { Card } from "@/components/ui/card";
import { BoolQuestionCard } from "./BoolAnswer";
import { MultipleQuestionCard } from "./MultipleAnswer";
import { ShortQuestionCard } from "./ShortAnswer";

interface QuizCardProps {
  questions: QuizQuestion[];
}

export const QuizCard = ({ questions }: QuizCardProps) => {
  return (
    <Card className="mx-auto flex h-[calc(100svh-1.5rem)] w-full max-w-4xl border-border/70 bg-card/90 py-0 shadow-sm backdrop-blur-sm md:h-[calc(100svh-2.5rem)]">
      <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
        {questions.map((question, index) => {
          switch (question.type) {
            case "multipleChoice":
              return <MultipleQuestionCard key={index} question={question} />;
            case "shortAnswer":
              return <ShortQuestionCard key={index} question={question} />;
            case "bool":
              return <BoolQuestionCard key={index} question={question} />;
            default:
              return null;
          }
        })}
      </div>
    </Card>
  );
};
