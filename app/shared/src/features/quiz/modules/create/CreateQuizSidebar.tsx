"use client";

import { CheckCircle2, FileText, ListChecks, Shuffle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PillToggle } from "@/components/ui/pill-toggle";
import { Separator } from "@/components/ui/separator";
import { useCreateQuizContext } from "@/features/quiz/modules/create/context/create-quiz-context";
import { cn } from "@/lib/utils";

const quizTimeOptions = ["10", "15", "20", "∞"] as const;
const questionAmountOptions = ["10", "20", "30", "40"] as const;
const difficultyOptions = ["Easy", "Mixed", "Hard"] as const;
const questionTypeOptions = [
  { value: "Mixed", label: "Mixed", icon: Shuffle },
  { value: "Multiple choice", label: "Multiple choice", icon: ListChecks },
  { value: "True / false", label: "True / false", icon: CheckCircle2 },
  { value: "Short answer", label: "Short answer", icon: FileText },
] as const;

type QuestionTypeValue = (typeof questionTypeOptions)[number]["value"];

export const CreateQuizSidebar = () => {
  const {
    quizSettings,
    updateQuizSetting,
    canCreate,
    selectionSummary,
    createQuiz,
  } = useCreateQuizContext();

  return (
    <aside className="min-w-0 xl:sticky xl:top-2 xl:self-start xl:w-full">
      <section className="overflow-hidden rounded-[18px] border border-border/60 bg-[var(--app-surface-primary)] shadow-[0_1px_0_rgba(15,23,42,0.02),0_1px_3px_rgba(15,23,42,0.03)]">
        <div className="p-3.5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.88rem] font-semibold tracking-[-0.02em] text-[var(--app-text-primary)]">
              Quiz options
            </p>
          </div>

          <Separator className="my-2.5" />

          <div className="flex flex-col gap-2">
            <OptionGroup
              label="Quiz time"
              options={quizTimeOptions}
              value={quizSettings.quizTime}
              onValueChange={(value) => updateQuizSetting("quizTime", value)}
            />
            <OptionGroup
              label="Question amount"
              options={questionAmountOptions}
              value={quizSettings.questionAmount}
              onValueChange={(value) =>
                updateQuizSetting("questionAmount", value)
              }
            />
            <OptionGroup
              label="Difficulty"
              options={difficultyOptions}
              value={quizSettings.difficulty}
              onValueChange={(value) => updateQuizSetting("difficulty", value)}
            />
            <QuestionTypeSelector
              value={quizSettings.questionType}
              onValueChange={(value) =>
                updateQuizSetting("questionType", value)
              }
            />

            <div className="pt-1">
              <Button
                type="button"
                className="h-9 w-full rounded-xl !border-0 bg-[var(--course-accent-soft)] text-[var(--course-accent-strong)] shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_8px_16px_color-mix(in_srgb,var(--course-accent-ring)_10%,transparent)] hover:bg-[var(--course-accent-soft)] active:bg-[var(--course-accent-soft)] disabled:bg-[color-mix(in_srgb,var(--course-accent-soft)_68%,var(--app-surface-primary))] disabled:text-[color-mix(in_srgb,var(--course-accent-strong)_56%,var(--app-text-muted))]"
                disabled={!canCreate}
                onClick={createQuiz}
              >
                Create quiz!
              </Button>
              <p className="mt-1 text-[0.72rem] leading-[1.3] text-[var(--app-text-muted)]">
                {selectionSummary}
              </p>
            </div>
          </div>
        </div>
      </section>
    </aside>
  );
};

const OptionGroup = <T extends string>({
  label,
  options,
  value,
  onValueChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onValueChange: (value: T) => void;
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--app-text-tertiary)]">
        {label}
      </p>
      <PillToggle
        aria-label={label}
        value={value}
        onValueChange={onValueChange}
        options={options.map((option) => ({
          value: option,
          label: option,
        }))}
        className="w-full rounded-[14px] bg-[var(--app-surface-secondary)] p-0.5 [--background:var(--course-accent-soft)] [--foreground:var(--course-accent-strong)]"
      />
    </div>
  );
};

const QuestionTypeSelector = ({
  value,
  onValueChange,
}: {
  value: QuestionTypeValue;
  onValueChange: (value: QuestionTypeValue) => void;
}) => {
  return (
    <div className="flex flex-col gap-[5px]">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--app-text-tertiary)]">
        Question type
      </p>
      <div className="flex flex-col gap-[5px]">
        {questionTypeOptions.map((option) => {
          const selected = option.value === value;
          const Icon = option.icon;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onValueChange(option.value)}
              className={cn(
                "group flex h-10 items-center gap-2.5 rounded-[12px] border px-3 text-left transition-shadow duration-150",
                selected
                  ? "border-transparent bg-[var(--course-accent-soft)] shadow-[0_4px_12px_color-mix(in_srgb,var(--course-accent-ring)_10%,transparent)]"
                  : "border-border/50 bg-[var(--app-surface-primary)]",
              )}
            >
              <div
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-[9px]",
                  selected
                    ? "bg-[color-mix(in_srgb,white_30%,var(--course-accent-soft))] text-[var(--course-accent-strong)]"
                    : "bg-[var(--app-surface-secondary)] text-[var(--app-text-tertiary)]",
                )}
                aria-hidden
              >
                <Icon className="size-3" />
              </div>
              <span
                className={cn(
                  "min-w-0 flex-1 text-[0.8rem] font-semibold leading-none tracking-[-0.02em]",
                  selected
                    ? "text-[var(--course-accent-strong)]"
                    : "text-[var(--app-text-primary)]",
                )}
              >
                {option.label}
              </span>
              <div
                className={cn(
                  "size-3 shrink-0 rounded-full",
                  selected
                    ? "bg-[color-mix(in_srgb,var(--course-accent-strong)_30%,transparent)]"
                    : "bg-transparent",
                )}
                aria-hidden
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
