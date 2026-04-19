import { LibraryBig } from "lucide-react";
import { useChapters } from "@/domains/material/hooks/useChapters";
import { useDocumentsByCourse } from "@/domains/material/hooks/useDocuments";
import { useTopicsByCourse } from "@/domains/material/hooks/useTopics";
import { useDashboardContext } from "@/features/dashboard/dashboard-context";
import { SelectionPanel } from "@/features/quiz/modules/create/scopes/SelectionPanel";

export const CourseScopePanel = () => {
  const { activeCourse } = useDashboardContext();
  const summary = `HydroWise will intelligently build a quiz from ${activeCourse.courseName}.`;
  const { chapters } = useChapters(activeCourse.id);
  const { topics } = useTopicsByCourse(activeCourse.id);
  const { documents } = useDocumentsByCourse(activeCourse.id);

  return (
    <SelectionPanel
      title="Choose course"
      description="This selection uses the whole course."
    >
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="flex w-full max-w-[480px] flex-col items-center gap-4">
          <div className="flex w-full flex-col items-center gap-4 rounded-[20px] border border-[color-mix(in_srgb,var(--course-accent-ring)_52%,var(--app-border-solid))] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--course-accent-soft)_22%,var(--app-surface-primary))_0%,var(--app-surface-primary)_100%)] px-5 py-5 text-center shadow-[0_1px_0_rgba(255,255,255,0.72)_inset,0_10px_20px_rgba(15,23,42,0.045)]">
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-[color-mix(in_srgb,var(--course-accent-ring)_72%,var(--app-border-solid))] bg-[color-mix(in_srgb,var(--course-accent-soft)_58%,var(--app-surface-primary))] text-[color-mix(in_srgb,var(--course-accent-strong)_78%,var(--app-text-primary))] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]"
              aria-hidden
            >
              <LibraryBig className="size-[20px]" strokeWidth={1.85} />
            </div>
            <p className="max-w-[32ch] text-[1rem] font-semibold leading-snug text-[var(--app-text-muted)]">
              {summary}
            </p>
            <p className="text-[0.82rem] font-medium leading-5 text-[var(--app-text-muted)]">
              Uses all available course material.
            </p>
          </div>
          <div className="grid w-full grid-cols-3 gap-3">
            <CourseStat label="Chapters" value={chapters.length} />
            <CourseStat label="Topics" value={topics.length} />
            <CourseStat label="Documents" value={documents.length} />
          </div>
        </div>
      </div>
    </SelectionPanel>
  );
};

type CourseStatProps = {
  label: string;
  value: number;
};

const CourseStat = ({ label, value }: CourseStatProps) => {
  return (
    <div className="flex flex-col items-center rounded-[15px] border border-[color-mix(in_srgb,var(--app-border-solid)_64%,transparent)] bg-[var(--app-surface-primary)] px-4 py-3 text-center shadow-[0_1px_0_rgba(15,23,42,0.02),0_10px_20px_rgba(15,23,42,0.035)]">
      <div className="text-[1.1rem] font-bold tracking-[-0.02em] text-[var(--app-text-primary)]">
        {value}
      </div>
      <div className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[var(--app-text-muted)]">
        {label}
      </div>
    </div>
  );
};
