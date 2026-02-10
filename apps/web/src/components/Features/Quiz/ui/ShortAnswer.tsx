import type { ShortAnswerQuestion } from "@hydrowise/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ShortQuestionProps {
  question: ShortAnswerQuestion;
}

export const ShortQuestionCard = ({ question }: ShortQuestionProps) => {
  return (
    <Card className="border-border/60 bg-background/40 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold leading-6">
          {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Input className="h-9 border-border/70 bg-background/80" />
      </CardContent>
    </Card>
  );
};
