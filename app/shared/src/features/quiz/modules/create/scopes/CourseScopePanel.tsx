import { LibraryBig } from "lucide-react";
import { useDashboardContext } from "@/features/dashboard/dashboard-context";

export const CourseScopePanel = () => {
  const { activeCourse } = useDashboardContext();

  const summary = activeCourse
    ? `Quiz will use all chapters, topics, and documents from ${activeCourse.courseName}.`
    : "Loading course…";

  return (
    <div className="space-y-3.5">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-[var(--app-border-solid)] pb-2.5">
        <div className="min-w-0">
          <p className="text-[0.78rem] font-bold uppercase tracking-[0.16em] text-foreground">
            Include full course
          </p>
          <p className="mt-1 max-w-2xl text-[0.95rem] font-medium leading-6 text-[var(--app-text-muted)]">
            Use the entire course as your quiz source, or let HydroWise balance
            coverage automatically.
          </p>
        </div>
        <div
          className="h-px min-w-20 flex-1 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--app-text-muted)_26%,transparent),transparent)]"
          aria-hidden
        />
      </div>
      <div className="rounded-[18px] border border-border/60 bg-[var(--app-surface-primary)] px-3.5 py-3.5 shadow-[0_1px_0_rgba(15,23,42,0.02),0_1px_3px_rgba(15,23,42,0.03)]">
        <div className="flex gap-4 rounded-[16px] border border-[color-mix(in_srgb,var(--course-accent-ring)_48%,var(--app-border-solid))] border-l-[4px] border-l-[color-mix(in_srgb,var(--course-accent-strong)_58%,var(--app-border-solid))] bg-[linear-gradient(90deg,color-mix(in_srgb,var(--course-accent-soft)_52%,var(--app-surface-primary))_0%,var(--app-surface-primary)_78%)] px-4 py-4">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--course-accent-ring)_70%,var(--app-border-solid))] bg-[color-mix(in_srgb,var(--course-accent-soft)_65%,var(--app-surface-primary))] text-[color-mix(in_srgb,var(--course-accent-strong)_78%,var(--app-text-primary))] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]"
            aria-hidden
          >
            <LibraryBig className="size-[22px]" strokeWidth={1.85} />
          </div>
          <p className="min-w-0 flex-1 self-center text-[1.02rem] font-semibold leading-snug text-[var(--app-text-muted)]">
            {summary}
          </p>
        </div>
      </div>
    </div>
  );
};
