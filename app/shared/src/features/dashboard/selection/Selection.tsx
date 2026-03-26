import { CourseSelector } from "@/features/dashboard/selection/course-selector/CourseSelector";
import { Upload } from "@/features/dashboard/selection/upload/Upload";

export const Selection = () => {
  return (
    <div className="mt-2.5 rounded-md border border-border bg-card p-3.5">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">
          Courses
        </span>
      </div>
      <CourseSelector />
      <div className="mt-2.5">
        <Upload />
      </div>
    </div>
  );
};
