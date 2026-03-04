import { format } from "date-fns";
import { RotateCw, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface QuizAttempt {
  title: string;
  score: number;
  date: Date;
  status?: "Passed" | "Needs Review";
}

interface QuizHistoryCardProps {
  attempt: QuizAttempt;
}

export const QuizHistoryCard = ({ attempt }: QuizHistoryCardProps) => {
  const status =
    attempt.status ?? (attempt.score >= 70 ? "Passed" : "Needs Review");
  const formattedDate = format(attempt.date, "MMM dd");

  const statusClassName = cn(
    "font-medium",
    status === "Passed" ? "text-emerald-700" : "text-amber-700",
  );

  return (
    <div className="flex w-full flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-medium leading-5 text-foreground">
        {attempt.title}
      </p>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="tabular-nums">{attempt.score}%</span>
          <span aria-hidden>|</span>
          <span className={statusClassName}>{status}</span>
          <span aria-hidden>|</span>
          <span className="tabular-nums">{formattedDate}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            aria-label={`Retry ${attempt.title}`}
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-md border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
            aria-label={`Delete ${attempt.title}`}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
