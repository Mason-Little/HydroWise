import { XIcon } from "lucide-react";
import { formatScore } from "@/features/dashboard/Info/overview/components/grades/lib/format";

type ScoreChipProps = {
  onRemove: () => void;
  value: number;
};

export const ScoreChip = ({ onRemove, value }: ScoreChipProps) => (
  <span className="inline-flex items-center gap-1 rounded-[var(--hw-radius)] border border-[var(--border-solid)]/65 bg-[var(--surface)]/90 px-1.5 py-0.5 text-[length:var(--font-size-sm)] text-[var(--text-secondary)] shadow-[var(--shadow-sm)]">
    <span className="font-medium text-[var(--text-primary)]">
      {formatScore(value)}
    </span>
    <button
      type="button"
      aria-label={`Remove score ${formatScore(value)}`}
      onClick={onRemove}
      className="text-[var(--text-muted)] transition-colors hover:text-[var(--text-secondary)]"
    >
      <XIcon className="size-3" />
    </button>
  </span>
);
