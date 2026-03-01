import { useState } from "react";
import { ChapterView } from "@/components/Features/Dashboard/CourseContext/Chapters/ChapterView";
import { ContextToggleGroup } from "@/components/Features/Dashboard/CourseContext/ui/ContextToggleGroup";
import { useChapters } from "@/hooks/query/chapter.queries";

interface CourseContextProps {
  courseId: string;
}

type CourseContextTab = "overview" | "chapters" | "quizzes";

export const CourseContext = ({ courseId }: CourseContextProps) => {
  const [activeTab, setActiveTab] = useState<CourseContextTab>("overview");

  const { chapters } = useChapters(courseId);

  return (
    <div
      className="flex w-full flex-col gap-2 rounded-xl border p-3"
      style={{
        backgroundColor: "var(--hw-surface)",
        borderColor: "var(--hw-border)",
      }}
    >
      <div className="flex w-full items-center justify-between">
        <h1 className="text-xl font-bold">NoteBook</h1>
        <ContextToggleGroup activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {activeTab === "chapters" && <ChapterView chapters={chapters} />}
      {activeTab === "quizzes" && <h1>Quizzes</h1>}
      {activeTab === "overview" && <h1>Overview</h1>}
    </div>
  );
};
