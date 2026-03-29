import type { GradeTrackerRow } from "@/features/dashboard/Info/overview/components/grades/lib/types";

type WeightProgressBarProps = {
  rows: GradeTrackerRow[];
};

export const WeightProgressBar = ({ rows }: WeightProgressBarProps) => (
  <div className="w-full min-w-0">
    <div
      className="flex h-2 w-full overflow-hidden rounded-full border border-[var(--border-solid)]/70 bg-[var(--surface-alt)]/70"
      role="img"
      aria-label="Course weight distribution and entered grade progress by category"
    >
      {rows.map((row) => {
        const earnedFraction =
          row.averagePct === null ? 0 : Math.min(1, row.averagePct / 100);

        return (
          <div
            key={row.rubricIndex}
            className="relative h-full border-r border-white/65 last:border-r-0"
            style={{ flex: `0 0 ${row.weightPct}%` }}
          >
            <div
              className="absolute inset-0 opacity-28"
              style={{ backgroundColor: row.fill }}
            />
            <div
              className="absolute inset-y-0 left-0 transition-[width] duration-300 ease-out"
              style={{
                width: `${earnedFraction * 100}%`,
                backgroundColor: row.fill,
              }}
            />
          </div>
        );
      })}
    </div>
    <div className="mt-1 flex w-full">
      {rows.map((row) => (
        <div
          key={row.rubricIndex}
          className="min-w-0 truncate px-0.5 text-center text-[9px] font-medium uppercase tracking-wide text-[var(--text-muted)]"
          style={{ flex: `0 0 ${row.weightPct}%` }}
          title={row.category}
        >
          {row.category}
        </div>
      ))}
    </div>
  </div>
);
