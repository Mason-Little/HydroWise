import type { Chapter } from "@hydrowise/entities";
import { ChapterDropdown } from "@/components/Features/Dashboard/CourseContext/Chapters/ChapterDropdown";

interface ChapterViewProps {
  chapters: Chapter[];
}

export const ChapterView = ({ chapters }: ChapterViewProps) => {
  return (
    <div>
      <div className="flex w-full items-center justify-between mb-2">
        <h1 className="font-bold">Chapters</h1>
      </div>
      <div className="flex w-full flex-col gap-2">
        {chapters.map((chapter) => (
          <div key={chapter.id} className="flex w-full ">
            <ChapterDropdown chapter={chapter} />
          </div>
        ))}
      </div>
    </div>
  );
};
