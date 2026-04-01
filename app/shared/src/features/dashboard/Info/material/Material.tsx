import { useEffect, useState } from "react";
import { useDashboardContext } from "@/features/dashboard/dashboard-context";
import { MaterialChapterList } from "@/features/dashboard/Info/material/components/MaterialChapterList";
import { MaterialContentPanel } from "@/features/dashboard/Info/material/components/MaterialContentPanel";
import { MaterialSelectionContext } from "@/features/dashboard/Info/material/context/MaterialSelectionContext";
import { useChapters } from "@/features/dashboard/Info/material/hooks/useChapters";

export const Material = () => {
  const { activeCourse } = useDashboardContext();
  const courseId = activeCourse?.id ?? "";
  const { chapters, isLoading } = useChapters(courseId);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);

  useEffect(() => {
    if (chapters.length === 0) {
      setActiveChapterId(null);
      return;
    }
    setActiveChapterId((prev) => {
      if (prev && chapters.some((c) => c.id === prev)) return prev;
      return chapters[0]?.id ?? null;
    });
  }, [chapters]);

  const activeChapter =
    chapters.find((c) => c.id === activeChapterId) ?? null;

  return (
    <MaterialSelectionContext.Provider
      value={{
        activeChapter,
        setActiveChapterId,
        chapters,
        isLoading,
        courseId,
      }}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-0 overflow-hidden rounded-[var(--app-radius-workspace)] border border-[color-mix(in_srgb,var(--app-border-solid)_48%,transparent)] bg-gradient-to-b from-[var(--app-surface-primary)] to-[color-mix(in_srgb,var(--app-surface-primary)_94%,var(--app-workspace-bg))] shadow-[0_0_0_1px_color-mix(in_srgb,var(--app-surface-primary)_40%,transparent)_inset,var(--app-shadow-soft)]">
        <div className="grid min-h-0 min-w-0 flex-1 grid-cols-1 grid-rows-[auto_minmax(0,1fr)] overflow-hidden max-md:grid-rows-[auto_minmax(0,1fr)] md:grid-cols-[minmax(176px,24vw)_minmax(0,1fr)] md:grid-rows-[minmax(0,1fr)]">
          <MaterialChapterList />
          <MaterialContentPanel />
        </div>
      </div>
    </MaterialSelectionContext.Provider>
  );
};
