import { XIcon } from "lucide-react";
import type { CSSProperties } from "react";
import { formatScore } from "@/features/dashboard/Info/overview/components/grades/lib/format";
import { cn } from "@/lib/utils";

type ScoreChipProps = {
  accent: string;
  onRemove: () => void;
  value: number;
};

export const ScoreChip = ({ accent, onRemove, value }: ScoreChipProps) => {
  const label = formatScore(value);

  return (
    <span
      className={cn(
        "box-border inline-flex h-[var(--assess-chip-h)] min-h-[var(--assess-chip-h)] min-w-[var(--assess-chip-minw)] shrink-0 items-center gap-0.5 rounded-[var(--assess-chip-r)] border border-[color-mix(in_srgb,var(--chip-accent)_34%,var(--border-solid))] px-[var(--assess-chip-pad-x)] text-[length:var(--assess-chip-fs)] font-semibold leading-none tabular-nums",
        "bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_91%,var(--chip-accent)_8%)_0%,color-mix(in_srgb,var(--surface)_80%,var(--chip-accent)_15%)_100%)]",
        "text-[color-mix(in_srgb,var(--chip-accent)_40%,var(--text-primary))] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.82),0_1px_2px_rgba(37,50,58,0.042)]",
      )}
      style={{ "--chip-accent": accent } as CSSProperties}
    >
      <span className="min-w-0 flex-1 text-center">{label}</span>
      <button
        type="button"
        aria-label={`Remove score ${label}`}
        onClick={onRemove}
        className="-mr-0.5 shrink-0 rounded p-0.5 text-[color-mix(in_srgb,var(--chip-accent)_45%,var(--text-tertiary))] opacity-70 transition-opacity hover:opacity-100"
      >
        <XIcon className="size-3" />
      </button>
    </span>
  );
};
