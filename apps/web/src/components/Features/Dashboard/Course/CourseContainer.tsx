import type { Course } from "@hydrowise/entities";
import { useState } from "react";
import { CourseCard } from "@/components/Features/Dashboard/Course/CourseCard";
import { UploadArea } from "@/components/Features/Dashboard/Upload/UploadArea";
import { CourseToggleGroup } from "./CourseToggleGroup";

interface CourseContainerProps {
  courses: Course[];
}

export const CourseContainer = ({ courses }: CourseContainerProps) => {
  const [activeTab, setActiveTab] = useState<"active" | "archived">("active");

  return (
    <div
      className="flex w-full flex-col gap-2 rounded-xl border p-3"
      style={{
        backgroundColor: "var(--hw-surface)",
        borderColor: "var(--hw-border)",
      }}
    >
      <div className="flex w-full items-center justify-between">
        <span
          className="text-sm font-medium"
          style={{ color: "var(--hw-muted)" }}
        >
          Courses
        </span>
        <CourseToggleGroup activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="flex w-full gap-2">
        {courses.map((course) => (
          <div key={course.id} className="min-w-0 flex-1">
            <CourseCard
              courseId={course.id}
              title={course.name}
              documents={10}
              quizzes={10}
            />
          </div>
        ))}
      </div>

      <UploadArea />
    </div>
  );
};
