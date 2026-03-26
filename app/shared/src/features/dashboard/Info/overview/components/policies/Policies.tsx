import { ScrollTextIcon } from "lucide-react";
import type { CourseRow } from "@/features/dashboard/Dashboard";
import { useDashboardContext } from "@/features/dashboard/Dashboard";
import { OverviewSectionCard } from "@/features/dashboard/Info/overview/components/OverviewSectionCard";

export const Policies = () => {
  const { activeCourse } = useDashboardContext();
  if (!activeCourse) return null;
  return <PoliciesContent course={activeCourse} />;
};

const PoliciesContent = ({ course }: { course: CourseRow }) => {
  const { policies } = course;
  if (!policies?.length) return null;
  return (
    <OverviewSectionCard title="Policies">
      <ul className="flex flex-col gap-2.5">
        {policies.map((policy) => (
          <li key={policy.label}>
            <div className="grid grid-cols-[auto_auto_minmax(0,1fr)] items-start gap-x-2 text-sm">
              <ScrollTextIcon
                className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                aria-hidden
              />
              <span className="shrink-0 text-muted-foreground">
                {policy.label}
              </span>
              <p className="min-w-0 break-words leading-relaxed text-foreground">
                {policy.summary || "—"}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </OverviewSectionCard>
  );
};
