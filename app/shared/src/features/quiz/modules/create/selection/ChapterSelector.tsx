import { useChapters } from "@/domains/material/hooks/useChapters";
import { useDashboardContext } from "@/features/dashboard/dashboard-context";
import { useCreateQuizContext } from "@/features/quiz/modules/create/context/create-quiz-context";
import { SelectableTile } from "@/features/quiz/modules/create/selection/SelectableTile";

export const ChapterSelector = () => {
  const { activeCourse } = useDashboardContext();

  if (!activeCourse) {
    return null;
  }

  return <ChapterSelectorContent courseId={activeCourse.id} />;
};

const ChapterSelectorContent = ({ courseId }: { courseId: string }) => {
  const { chapters } = useChapters(courseId);
  const { selectedChapterIds, setSelectedChapterIds } = useCreateQuizContext();

  return (
    <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
      {chapters.map((chapter) => {
        const selected = selectedChapterIds.includes(chapter.id);
        const onSelect = () => {
          setSelectedChapterIds(
            selected
              ? selectedChapterIds.filter((id) => id !== chapter.id)
              : [...selectedChapterIds, chapter.id],
          );
        };

        return (
          <SelectableTile
            key={chapter.id}
            selected={selected}
            onSelect={onSelect}
            title={chapter.chapterName}
            description={chapter.chapterDescription}
          />
        );
      })}
    </div>
  );
};
