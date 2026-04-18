import { useMaterialSelection } from "@/features/dashboard/Info/material/context/MaterialSelectionContext";
import { cn } from "@/lib/utils";

export const MaterialChapterList = () => {
  const material = useMaterialSelection();

  return (
    <nav
      aria-label="Weeks and chapters"
      className={cn(
        "flex max-h-[min(280px,42dvh)] min-h-0 shrink-0 flex-col gap-1.5 overflow-y-auto overscroll-contain border-b border-solid border-[color-mix(in_srgb,var(--app-hairline)_70%,transparent)] bg-[color-mix(in_srgb,var(--app-workspace-bg)_35%,var(--app-surface-primary))] px-2.5 py-3 md:max-h-[min(560px,62dvh)] md:border-b-0 md:border-r md:border-solid md:pr-2.5",
      )}
    >
      {material.status === "loading" ? (
        <p className="px-3 py-2 text-[12px] font-medium text-[var(--app-text-muted)]">
          Loading chapters…
        </p>
      ) : material.status === "empty" ? (
        <p className="px-3 py-2 text-[12px] font-medium text-[var(--app-text-muted)]">
          No chapters yet.
        </p>
      ) : (
        material.chapters.map((chapter, index) => {
          const isActive = material.activeChapter.id === chapter.id;
          const orderLabel = String(index + 1).padStart(2, "0");
          const meta = chapter.chapterDescription.trim();

          return (
            <button
              key={chapter.id}
              type="button"
              aria-current={isActive ? "page" : undefined}
              onClick={() => {
                material.setActiveChapterId(chapter.id);
              }}
              className={cn(
                "group relative box-border grid h-20 min-h-20 max-h-20 w-full shrink-0 cursor-pointer grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 overflow-hidden rounded-xl border border-transparent px-3.5 py-2.5 pl-3.5 text-left font-[inherit] text-inherit transition-[background,border-color,box-shadow] duration-[140ms] ease-out",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--course-accent-ring)_65%,var(--app-border-solid))]",
                isActive
                  ? [
                      "border-[var(--course-accent-ring)] bg-[color-mix(in_srgb,var(--course-accent-soft)_68%,var(--app-surface-primary))] shadow-[inset_0_1px_0_color-mix(in_srgb,var(--app-surface-primary)_65%,transparent),0_1px_3px_color-mix(in_srgb,var(--course-accent-strong)_8%,transparent)]",
                      "before:pointer-events-none before:absolute before:bottom-[11px] before:left-[5px] before:top-[11px] before:w-[3px] before:rounded-full before:bg-gradient-to-b before:from-[color-mix(in_srgb,var(--course-accent-strong)_35%,var(--app-accent))] before:to-[color-mix(in_srgb,var(--app-accent)_80%,var(--course-accent-strong))] before:shadow-[0_0_0_1px_color-mix(in_srgb,var(--app-surface-primary)_40%,transparent)] before:content-['']",
                    ]
                  : "hover:border-[color-mix(in_srgb,var(--app-border-solid)_32%,transparent)]",
              )}
            >
              <span
                className={cn(
                  "min-w-[1.6rem] text-left font-display text-[13px] font-bold leading-none tracking-[-0.03em] text-[var(--app-text-tertiary)]",
                  isActive &&
                    "text-[color-mix(in_srgb,var(--course-accent-strong)_55%,var(--app-text-tertiary))]",
                  !isActive &&
                    "group-hover:text-[color-mix(in_srgb,var(--app-text-muted)_78%,var(--app-text-primary))]",
                )}
              >
                {orderLabel}
              </span>
              <span className="flex min-h-0 min-w-0 flex-col justify-center gap-1">
                <span
                  className={cn(
                    "line-clamp-2 min-h-[calc(1.35em*2)] text-[12px] font-semibold leading-[1.35] tracking-[-0.01em] text-[var(--app-text-primary)]",
                    !isActive &&
                      "group-hover:text-[color-mix(in_srgb,var(--app-text-primary)_97%,var(--app-text-muted))]",
                  )}
                >
                  {chapter.chapterName}
                </span>
                {meta ? (
                  <span
                    className={cn(
                      "truncate text-[10px] font-medium leading-tight text-[var(--app-text-muted)]",
                      !isActive &&
                        "group-hover:text-[color-mix(in_srgb,var(--app-text-muted)_94%,var(--app-text-primary))]",
                    )}
                  >
                    {meta}
                  </span>
                ) : null}
              </span>
            </button>
          );
        })
      )}
    </nav>
  );
};
