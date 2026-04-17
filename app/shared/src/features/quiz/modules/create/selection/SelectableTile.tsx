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
        "rounded-[20px] border px-4 py-4 text-left transition",
        selected
          ? "border-[var(--course-accent-ring)] bg-[color-mix(in_srgb,var(--course-accent-soft)_55%,var(--app-surface-primary))]"
          : "border-border/60 bg-[var(--app-surface-primary)] hover:border-border/80",
      )}
    >
      <div className="text-[0.98rem] font-semibold text-[var(--app-text-primary)]">
        {title}
      </div>
      <div className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--app-text-muted)]">
        {description}
      </div>
    </button>
  );
};
