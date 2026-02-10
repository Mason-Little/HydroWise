import type { MultipleChoiceQuestion } from "@hydrowise/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface MultipleQuestionProps {
  question: MultipleChoiceQuestion;
}

export const MultipleQuestionCard = ({ question }: MultipleQuestionProps) => {
  return (
    <Card className="border-border/60 bg-background/40 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold leading-6">
          {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <RadioGroup className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {question.options.map((option) => (
            <div
              key={option}
              className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/70 px-3 py-2 transition-colors hover:bg-accent/30"
            >
              <RadioGroupItem value={option} id={option} />
              <Label htmlFor={option} className="cursor-pointer leading-tight">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
