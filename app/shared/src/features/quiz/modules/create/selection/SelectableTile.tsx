import { cn } from "@/lib/utils";

type SelectableTileProps = {
  selected: boolean;
  onSelect: () => void;
  title: string;
  description: string;
};

export const SelectableTile = ({
  selected,
  onSelect,
  title,
  description,
}: SelectableTileProps) => {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "rounded-[16px] border px-3.5 py-2.5 text-left transition-[border-color,background-color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--course-accent-ring)_75%,var(--app-border-solid))] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-surface-primary)]",
        selected
          ? "border-[color-mix(in_srgb,var(--course-accent-ring)_95%,var(--app-border-solid))] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--course-accent-soft)_42%,var(--app-surface-primary))_0%,color-mix(in_srgb,var(--app-surface-primary)_95%,var(--course-accent-soft))_100%)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--course-accent-strong)_10%,transparent)]"
          : "border-border/60 bg-[var(--app-surface-primary)] hover:-translate-y-px hover:border-border/80 hover:shadow-[0_10px_18px_rgba(37,50,58,0.045)]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div
            className={cn(
              "line-clamp-2 text-[0.84rem] font-semibold leading-5 tracking-[-0.01em]",
              selected
                ? "text-[color-mix(in_srgb,var(--course-accent-strong)_76%,var(--app-text-primary))]"
                : "text-[var(--app-text-primary)]",
            )}
          >
            {title}
          </div>
          <div className="mt-0.5 line-clamp-2 text-[0.76rem] leading-[1.35] text-[var(--app-text-muted)]">
            {description}
          </div>
        </div>
        <div
          className={cn(
            "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors",
            selected
              ? "border-[color-mix(in_srgb,var(--course-accent-strong)_40%,var(--app-border-solid))] bg-[color-mix(in_srgb,var(--course-accent-strong)_90%,var(--app-surface-primary))]"
              : "border-[color-mix(in_srgb,var(--app-border-solid)_70%,transparent)] bg-transparent",
          )}
          aria-hidden
        >
          <span
            className={cn(
              "size-1.5 rounded-full transition-colors",
              selected
                ? "bg-[color-mix(in_srgb,var(--app-surface-primary)_94%,white)]"
                : "bg-transparent",
            )}
          />
        </div>
      </div>
    </button>
  );
};
