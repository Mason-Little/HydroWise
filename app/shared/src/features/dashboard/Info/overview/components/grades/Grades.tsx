import { useDashboardContext } from "@/features/dashboard/Dashboard";
import { GradeCard } from "@/features/dashboard/Info/overview/components/grades/GradeCard";

export const Grades = () => {
  const { activeCourse } = useDashboardContext();
  if (!activeCourse) return null;

  return <GradeCard course={activeCourse} />;
};
