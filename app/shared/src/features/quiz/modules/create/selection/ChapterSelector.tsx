import type { Dispatch, SetStateAction } from "react";
import { useChapters } from "@/domains/material/hooks/useChapters";
import { useDashboardContext } from "@/features/dashboard/dashboard-context";
import type { CreateQuizSelection } from "@/features/quiz/modules/create/context/create-quiz-context";
import { SelectableTile } from "@/features/quiz/modules/create/selection/SelectableTile";

type ChapterSelectorProps = {
  chapterIds: string[];
  setSelection: Dispatch<SetStateAction<CreateQuizSelection>>;
};

export const ChapterSelector = ({
  chapterIds,
  setSelection,
}: ChapterSelectorProps) => {
  const { activeCourse } = useDashboardContext();
  const { chapters } = useChapters(activeCourse.id);

  return (
    <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
      {chapters.map((chapter) => {
        const selected = chapterIds.includes(chapter.id);
        const onSelect = () => {
          setSelection({
            scope: "chapter",
            chapterIds: selected
              ? chapterIds.filter((id) => id !== chapter.id)
              : [...chapterIds, chapter.id],
          });
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
