import { OverviewHeader } from "@/components/Features/Dashboard/CourseContext/Overview/Header/Header";
import { OverviewCalendar } from "@/components/Features/Dashboard/CourseContext/Overview/OverviewCalendar";
import { OverviewRubric } from "@/components/Features/Dashboard/CourseContext/Overview/OverviewRubric";

interface OverviewContainerProps {
  courseId: string;
}

export const OverviewContainer = ({
  courseId: _courseId,
}: OverviewContainerProps) => {
  return (
    <div className="flex w-full flex-col gap-4">
      <h2 className="text-sm font-semibold">Syllabus Overview</h2>
      <OverviewHeader />
      <OverviewRubric />
      <OverviewCalendar />
    </div>
  );
};
