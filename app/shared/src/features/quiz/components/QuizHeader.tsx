import { PillToggle } from "@/components/ui/pill-toggle";
import { useDashboardContext } from "@/features/dashboard/dashboard-context";
import { useQuizContext } from "@/features/quiz/context/quiz-context";

const titleByView = {
  create: "Quizzes • Create",
  history: "Quizzes • History",
  write: "Quizzes • Write",
} as const;

const subtitleByView = {
  create: "Build adaptive practice sets in seconds.",
  history: "Review saved practice sessions and past results.",
  write: "Draft custom quizzes from your course material.",
} as const;

export const QuizHeader = () => {
  const { activeCourse } = useDashboardContext();
  const { view, setView } = useQuizContext();

  const eyebrow = activeCourse
    ? `${activeCourse.courseCode} · ${activeCourse.courseName}`
    : "Select a course above";

  return (
    <div className="border-b border-[color-mix(in_srgb,var(--course-accent-strong)_18%,transparent)] pb-2.5">
      <p className="mb-1 text-[length:var(--type-dashboard-micro)] font-semibold uppercase tracking-[0.18em] text-[color-mix(in_srgb,var(--course-accent-strong)_80%,transparent)]">
        {eyebrow}
      </p>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="font-display truncate text-[clamp(1.65rem,2.4vw,2.35rem)] font-bold leading-[1.04] tracking-[-0.045em] text-foreground">
            {titleByView[view]}
          </h1>
          <p className="mt-2 max-w-2xl text-[length:var(--type-dashboard-micro)] font-medium leading-6 tracking-[0.01em] text-[#5a6f68]">
            {subtitleByView[view]}
          </p>
        </div>
        <div className="shrink-0">
          <PillToggle
            options={[
              { value: "create", label: "Create" },
              { value: "history", label: "History" },
              { value: "write", label: "Write" },
            ]}
            value={view}
            onValueChange={setView}
            aria-label="Quiz view"
            className="bg-background/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_8px_24px_rgba(37,50,58,0.06)]"
          />
        </div>
      </div>
    </div>
  );
};
