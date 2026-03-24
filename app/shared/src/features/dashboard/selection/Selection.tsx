import { CourseSelector } from "@/features/dashboard/selection/course-selector/CourseSelector";
import { Upload } from "@/features/dashboard/selection/upload/Upload";

export const Selection = () => {
  return (
    <div className="mt-3 rounded-sm border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-muted-foreground">Courses</span>
      </div>
      <CourseSelector />
      <div className="mt-3">
        <Upload />
      </div>
    </div>
  );
};
