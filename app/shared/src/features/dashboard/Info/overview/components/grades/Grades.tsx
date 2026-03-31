import { useDashboardContext } from "@/features/dashboard/Dashboard";
import { GradeCard } from "@/features/dashboard/Info/overview/components/grades/GradeCard";

export const Grades = () => {
  const { activeCourse } = useDashboardContext();
  if (!activeCourse) return null;

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col lg:h-[var(--overview-pane-h)] lg:min-h-[280px] lg:max-h-[var(--overview-pane-h)] lg:overflow-hidden">
      <GradeCard course={activeCourse} />
    </div>
  );
};
