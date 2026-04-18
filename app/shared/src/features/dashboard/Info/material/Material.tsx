import type { Chapter } from "@hydrowise/entities";
import { useState } from "react";
import { useChapters } from "@/domains/material/hooks/useChapters";
import { useDashboardContext } from "@/features/dashboard/dashboard-context";
import { MaterialChapterList } from "@/features/dashboard/Info/material/components/MaterialChapterList";
import { MaterialContentPanel } from "@/features/dashboard/Info/material/components/MaterialContentPanel";
import {
  MaterialSelectionContext,
  type MaterialSelectionContextValue,
} from "@/features/dashboard/Info/material/context/MaterialSelectionContext";

export const Material = () => {
  const { activeCourse } = useDashboardContext();
  const { chapters, isLoading } = useChapters(activeCourse.id);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const selectionState = buildMaterialSelectionState(
    activeCourse.id,
    chapters,
    isLoading,
    activeChapterId,
    setActiveChapterId,
  );

  return (
    <MaterialSelectionContext.Provider value={selectionState}>
      <div className="flex min-h-0 flex-1 flex-col gap-0 overflow-hidden rounded-[var(--app-radius-workspace)] border border-[color-mix(in_srgb,var(--app-border-solid)_48%,transparent)] bg-gradient-to-b from-[var(--app-surface-primary)] to-[color-mix(in_srgb,var(--app-surface-primary)_94%,var(--app-workspace-bg))] shadow-[0_0_0_1px_color-mix(in_srgb,var(--app-surface-primary)_40%,transparent)_inset,var(--app-shadow-soft)]">
        <div className="grid min-h-0 min-w-0 flex-1 grid-cols-1 grid-rows-[auto_minmax(0,1fr)] overflow-hidden max-md:grid-rows-[auto_minmax(0,1fr)] md:grid-cols-[minmax(176px,24vw)_minmax(0,1fr)] md:grid-rows-[minmax(0,1fr)]">
          <MaterialChapterList />
          <MaterialContentPanel />
        </div>
      </div>
    </MaterialSelectionContext.Provider>
  );
};

// Resolves the current material selection state for the active course.
function buildMaterialSelectionState(
  courseId: string,
  chapters: Chapter[],
  isLoading: boolean,
  activeChapterId: string | null,
  setActiveChapterId: (chapterId: string) => void,
): MaterialSelectionContextValue {
  if (isLoading) {
    return {
      status: "loading",
      courseId,
      chapters,
      setActiveChapterId,
    };
  }

  if (chapters.length === 0) {
    return {
      status: "empty",
      courseId,
      chapters,
      setActiveChapterId,
    };
  }

  const activeChapter =
    chapters.find((chapter) => chapter.id === activeChapterId) ?? chapters[0];

  return {
    status: "ready",
    courseId,
    chapters,
    activeChapter,
    setActiveChapterId,
  };
}
