import { ScrollTextIcon } from "lucide-react";
import type { CourseRow } from "@/features/dashboard/Dashboard";
import { useDashboardContext } from "@/features/dashboard/Dashboard";
import { OverviewDetailRow } from "@/features/dashboard/Info/overview/components/OverviewDetailRow";
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
            <OverviewDetailRow icon={ScrollTextIcon} label={policy.label}>
              <p className="break-words leading-relaxed text-foreground">
                {policy.summary || "—"}
              </p>
            </OverviewDetailRow>
          </li>
        ))}
      </ul>
    </OverviewSectionCard>
  );
};
