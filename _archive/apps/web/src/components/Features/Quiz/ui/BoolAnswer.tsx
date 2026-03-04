import type { BoolQuestion } from "@hydrowise/entities";
import { useId } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface BoolQuestionProps {
  question: BoolQuestion;
}

export const BoolQuestionCard = ({ question }: BoolQuestionProps) => {
  const baseId = useId();
  const trueId = `${baseId}-true`;
  const falseId = `${baseId}-false`;

  return (
    <Card className="border-border/60 bg-background/40 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold leading-6">
          {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <RadioGroup
          defaultValue="true"
          className="grid grid-cols-1 gap-2 sm:grid-cols-2"
        >
          <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/70 px-3 py-2 transition-colors hover:bg-accent/30">
            <RadioGroupItem value="true" id={trueId} />
            <Label htmlFor={trueId} className="cursor-pointer leading-tight">
              True
            </Label>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/70 px-3 py-2 transition-colors hover:bg-accent/30">
            <RadioGroupItem value="false" id={falseId} />
            <Label htmlFor={falseId} className="cursor-pointer leading-tight">
              False
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
