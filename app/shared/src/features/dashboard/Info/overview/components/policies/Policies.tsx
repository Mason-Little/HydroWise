import { ScrollTextIcon } from "lucide-react";
import { useDashboardContext } from "@/features/dashboard/Dashboard";
import { OverviewDetailRow } from "@/features/dashboard/Info/overview/components/OverviewDetailRow";
import { OverviewSectionCard } from "@/features/dashboard/Info/overview/components/OverviewSectionCard";

export const Policies = () => {
  const { activeCourse } = useDashboardContext();
  if (!activeCourse) return null;
  const { policies } = activeCourse;
  if (!policies?.length) return null;
  return (
    <OverviewSectionCard
      title="Policies"
      className="flex h-full min-h-0 flex-col"
    >
      <ul className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto pr-0.5">
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
