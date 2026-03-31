import type { GradeTrackerRow } from "@/features/dashboard/Info/overview/components/grades/lib/types";

type WeightProgressBarProps = {
  rows: GradeTrackerRow[];
};

const earnedFillFraction = (row: GradeTrackerRow): number =>
  row.averagePct === null ? 0 : Math.min(1, row.averagePct / 100);

export const WeightProgressBar = ({ rows }: WeightProgressBarProps) => (
  <div className="w-full min-w-0">
    <div
      className="flex h-3 w-full gap-px overflow-hidden rounded-md border border-[color-mix(in_srgb,var(--border-solid)_70%,transparent)] bg-[color-mix(in_srgb,var(--surface)_78%,#ebeae8)] p-px"
      role="img"
      aria-label="Course weight distribution and entered grade progress by category"
    >
      {rows.map((row) => {
        const earnedFraction = earnedFillFraction(row);

        return (
          <div
            key={row.rubricIndex}
            className="relative min-w-0 overflow-hidden rounded-none bg-[color-mix(in_srgb,var(--surface)_58%,#e2e1df)]"
            style={{ flex: `0 0 ${row.weightPct}%` }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.32]"
              style={{ backgroundColor: row.fill }}
            />
            <div
              className="absolute inset-y-0 left-0 transition-[width] duration-300 ease-out"
              style={{
                width: `${earnedFraction * 100}%`,
                backgroundColor: row.fill,
                opacity: 1,
              }}
            />
          </div>
        );
      })}
    </div>
    <div className="mt-1.5 flex w-full gap-1">
      {rows.map((row) => (
        <div
          key={row.rubricIndex}
          className="min-w-0 text-center text-[length:var(--type-dashboard-micro)] font-semibold leading-[1.3] text-[#6f7c85]"
          style={{ flex: `0 0 ${row.weightPct}%` }}
          title={row.category}
        >
          <span className="block truncate">{row.category}</span>
        </div>
      ))}
    </div>
  </div>
);
