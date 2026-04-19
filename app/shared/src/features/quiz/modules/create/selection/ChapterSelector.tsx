import { useChapters } from "@/domains/material/hooks/useChapters";
import { useDashboardContext } from "@/features/dashboard/dashboard-context";
import { SelectableTile } from "@/features/quiz/modules/create/selection/SelectableTile";

type ChapterSelectorProps = {
  chapterIds: string[];
  toggleChapter: (chapterId: string) => void;
};

export const ChapterSelector = ({
  chapterIds,
  toggleChapter,
}: ChapterSelectorProps) => {
  const { activeCourse } = useDashboardContext();
  const { chapters } = useChapters(activeCourse.id);

  return (
    <div className="grid gap-2.5 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
      {chapters.map((chapter) => {
        const selected = chapterIds.includes(chapter.id);

        return (
          <SelectableTile
            key={chapter.id}
            selected={selected}
            onSelect={() => toggleChapter(chapter.id)}
            title={chapter.name}
            description={chapter.description}
          />
        );
      })}
    </div>
  );
};
