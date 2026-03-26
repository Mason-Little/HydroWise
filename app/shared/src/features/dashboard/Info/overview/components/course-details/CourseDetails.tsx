import type { CourseRow } from "@/features/dashboard/Dashboard";
import { useDashboardContext } from "@/features/dashboard/Dashboard";
import { useCourseDetailRows } from "@/features/dashboard/Info/overview/components/course-details/hooks/useCourseDetailRows";
import { EditableField } from "@/features/dashboard/Info/overview/components/EditableField";
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
              <div className="grid grid-cols-[auto_auto_minmax(0,1fr)] items-start gap-x-2 text-sm">
                <Icon
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
                <span className="shrink-0 text-muted-foreground">{label}</span>
                <div className="min-w-0 text-left font-medium text-foreground">
                  <EditableField
                    value={row.value(course)}
                    placeholder={row.placeholder}
                    onSave={row.onSave}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </OverviewSectionCard>
  );
};
