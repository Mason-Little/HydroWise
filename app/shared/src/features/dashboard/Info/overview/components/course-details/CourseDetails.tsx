import type { CourseRow } from "@/features/dashboard/Dashboard";
import { useDashboardContext } from "@/features/dashboard/Dashboard";
import { useCourseDetailRows } from "@/features/dashboard/Info/overview/components/course-details/hooks/useCourseDetailRows";
import { EditableField } from "@/features/dashboard/Info/overview/components/EditableField";
import { OverviewDetailRow } from "@/features/dashboard/Info/overview/components/OverviewDetailRow";
import { OverviewSectionCard } from "@/features/dashboard/Info/overview/components/OverviewSectionCard";

export const CourseDetails = () => {
  const { activeCourse } = useDashboardContext();
  if (!activeCourse) return null;
  return <CourseDetailsContent course={activeCourse} />;
};

const CourseDetailsContent = ({ course }: { course: CourseRow }) => {
  const rows = useCourseDetailRows(course.id);

  return (
    <OverviewSectionCard title="Course details">
      <ul className="flex flex-col gap-2.5">
        {rows.map((row) => {
          const { label, icon: Icon } = row;
          return (
            <li key={label}>
              <OverviewDetailRow icon={Icon} label={label}>
                <div className="font-medium text-foreground">
                  <EditableField
                    value={row.value(course)}
                    placeholder={row.placeholder}
                    onSave={row.onSave}
                  />
                </div>
              </OverviewDetailRow>
            </li>
          );
        })}
      </ul>
    </OverviewSectionCard>
  );
};
