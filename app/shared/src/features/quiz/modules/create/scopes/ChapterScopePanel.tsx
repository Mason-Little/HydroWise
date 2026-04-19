import { SelectionPanel } from "@/features/quiz/modules/create/scopes/SelectionPanel";
import { ChapterSelector } from "@/features/quiz/modules/create/selection/ChapterSelector";

type ChapterScopePanelProps = {
  chapterIds: string[];
  toggleChapter: (chapterId: string) => void;
};

export const ChapterScopePanel = ({
  chapterIds,
  toggleChapter,
}: ChapterScopePanelProps) => {
  return (
    <SelectionPanel
      title="Choose chapters"
      description="Pick the chapters you want included in this quiz set."
    >
      <ChapterSelector chapterIds={chapterIds} toggleChapter={toggleChapter} />
    </SelectionPanel>
  );
};
