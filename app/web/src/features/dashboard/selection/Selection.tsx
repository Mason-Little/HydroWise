import { CourseSelector } from "@/features/dashboard/selection/course-selector/CourseSelector";
import { Upload } from "@/features/dashboard/selection/upload/Upload";

export const Selection = () => {
  return (
    <div>
      <CourseSelector />
      <Upload />
    </div>
  );
};
