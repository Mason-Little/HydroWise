import { useTopicsByChapter } from "@/domains/material/hooks/useTopics";
import { MaterialTopicSection } from "@/features/dashboard/Info/material/components/MaterialTopicSection";
import {
  type MaterialSelectionContextValue,
  useMaterialSelection,
} from "@/features/dashboard/Info/material/context/MaterialSelectionContext";
import { cn } from "@/lib/utils";

const MATERIAL_QUICK_ACTION_LABELS = [
  "Ask AI about chapter",
  "Generate quiz",
  "Make flashcards",
] as const;

export const MaterialContentPanel = () => {
  const material = useMaterialSelection();

  if (material.status === "loading") {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center px-6 py-10">
        <p className="text-sm text-[var(--app-text-muted)]">Loading topics…</p>
      </div>
    );
  }

  if (material.status === "empty") {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center px-6 py-10">
        <p className="text-sm text-[var(--app-text-muted)]">
          No chapter selected
        </p>
      </div>
    );
  }

  return <MaterialContentPanelReady material={material} />;
};

const MaterialContentPanelReady = ({
  material,
}: {
  material: Extract<MaterialSelectionContextValue, { status: "ready" }>;
}) => {
  const { topics, isLoading } = useTopicsByChapter(material.activeChapter.id);
  const description = material.activeChapter.chapterDescription.trim();
  const chapterIndex = material.chapters.findIndex(
    (chapter) => chapter.id === material.activeChapter.id,
  );
  const chapterOrdinal =
    chapterIndex >= 0 ? String(chapterIndex + 1).padStart(2, "0") : "—";
  const topicCount = topics?.length ?? 0;
  const topicsLoaded = !isLoading && topics != null;

  return (
    <article
      className={cn(
        "flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overscroll-contain",
        "px-6 pb-8 pt-6 sm:px-[26px]",
      )}
    >
      <header className="shrink-0">
        <p
          className={cn(
            "mb-2 text-[10px] font-bold uppercase tracking-[0.14em]",
            "text-[var(--app-text-tertiary)]",
          )}
        >
          Chapter {chapterOrdinal}
        </p>
        <h2
          className={cn(
            "font-display text-xl font-bold leading-tight tracking-[-0.04em] sm:text-2xl",
            "text-[var(--app-text-primary)]",
          )}
        >
          {material.activeChapter.chapterName}
        </h2>
        {description ? (
          <p
            className={cn(
              "mt-1.5 text-xs font-medium leading-snug",
              "text-[var(--app-text-muted)]",
            )}
          >
            {description}
          </p>
        ) : null}
      </header>

      {topicsLoaded ? (
        <>
          <p
            className={cn(
              "mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 rounded-[11px] border border-[color-mix(in_srgb,var(--app-border-solid)_35%,transparent)] px-3.5 py-2.5 text-[11px] font-medium shadow-[inset_0_1px_0_color-mix(in_srgb,var(--app-surface-primary)_65%,transparent)]",
              "bg-[color-mix(in_srgb,var(--app-workspace-bg)_45%,var(--app-surface-primary))]",
              "text-[var(--app-text-muted)]",
            )}
            role="status"
          >
            <strong className="font-semibold text-[var(--app-text-primary)]">
              {topicCount}
            </strong>
            <span>topic groups</span>
          </p>
          <div className="mb-1.5 mt-4 flex flex-wrap gap-2">
            {MATERIAL_QUICK_ACTION_LABELS.map((label) => (
              <button
                key={label}
                type="button"
                disabled
                className={cn(
                  "cursor-not-allowed rounded-[10px] border border-[color-mix(in_srgb,var(--app-border-solid)_55%,transparent)] px-3.5 py-2 text-[11px] font-semibold opacity-60",
                  "bg-[color-mix(in_srgb,var(--course-accent-soft)_35%,var(--app-surface-primary))]",
                  "text-[var(--app-text-primary)] shadow-[inset_0_1px_0_color-mix(in_srgb,var(--app-surface-primary)_55%,transparent)]",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex min-h-0 flex-1 flex-col">
            {topics.map((topic, sectionIndex) => (
              <MaterialTopicSection
                key={topic.id}
                topic={topic}
                sectionIndex={sectionIndex}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex min-h-0 flex-1 items-center justify-center px-6 py-10">
          <p className="text-sm text-[var(--app-text-muted)]">
            Loading topics…
          </p>
        </div>
      )}
    </article>
  );
};
