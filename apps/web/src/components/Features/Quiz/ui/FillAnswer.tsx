import type { FillInTheBlankQuestion } from "@hydrowise/entities";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface FillQuestionProps {
  question: FillInTheBlankQuestion;
}

export const FillQuestionCard = ({ question }: FillQuestionProps) => {
  const [values, setValues] = useState<Record<number, string>>({});

  const onChange = (index: number, value: string) => {
    setValues((prev) => ({ ...prev, [index]: value }));
  };

  return (
    <Card className="w-full border-border/60 bg-background/40 shadow-none">
      <CardContent className="py-4">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-3 text-sm leading-7">
          {question.segments.map((seg, i) => {
            if (seg.type === "question") {
              return (
                <span key={`${seg.type}-${i}`} className="text-foreground/90">
                  {seg.content}
                </span>
              );
            }

            return (
              <Input
                key={`${seg.type}-${i}`}
                value={values[i] ?? ""}
                onChange={(e) => onChange(i, e.target.value)}
                className="h-9 w-28 min-w-20 border-border/70 bg-background/80"
              />
            );
          })}
        </p>
      </CardContent>
    </Card>
  );
};
