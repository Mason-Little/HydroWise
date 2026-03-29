import type { GradePlannerState } from "@hydrowise/entities";
import { ScoreChip } from "@/features/dashboard/Info/overview/components/grades/components/ScoreChip";
import { ScoreInput } from "@/features/dashboard/Info/overview/components/grades/components/ScoreInput";
import {
  getRowEntryPercent,
  getRowRemainingLabel,
  getTargetPlaceholder,
} from "@/features/dashboard/Info/overview/components/grades/lib/copy";
import { formatPercent } from "@/features/dashboard/Info/overview/components/grades/lib/format";
import { getPlannerScores } from "@/features/dashboard/Info/overview/components/grades/lib/planner-state";
import type { GradeTrackerRow } from "@/features/dashboard/Info/overview/components/grades/lib/types";

type CompactCategoryRowProps = {
  onAddScore: (rubricIndex: string, score: number) => void;
  onRemoveScore: (rubricIndex: string, scoreIndex: number) => void;
  plannerState: GradePlannerState;
  row: GradeTrackerRow;
};

const getScoreKey = (
  rubricIndex: string,
  scores: number[],
  score: number,
  scoreIndex: number,
) => {
  const occurrence = scores
    .slice(0, scoreIndex + 1)
    .filter((entry) => entry === score).length;

  return `${rubricIndex}:${score}:${occurrence}`;
};

export const CompactCategoryRow = ({
  onAddScore,
  onRemoveScore,
  plannerState,
  row,
}: CompactCategoryRowProps) => {
  const scores = getPlannerScores(plannerState, row.rubricIndex);
  const entryPercent = getRowEntryPercent(row);
  const remainingLabel = getRowRemainingLabel(row);
  const needLabel = getTargetPlaceholder(row);
  const scoreInputPlaceholder =
    row.remainingCount === 0 ? "Add" : needLabel;

  const avgDisplay =
    row.averagePct !== null ? `avg ${Math.round(row.averagePct)}` : "—";

  return (
    <div className="rounded-[var(--hw-radius-lg)] border border-[var(--border-solid)]/50 bg-[var(--surface)]/40 px-2.5 py-2">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span
          className="size-2 shrink-0 rounded-full"
          style={{ backgroundColor: row.fill }}
          aria-hidden
        />
        <span className="min-w-0 flex-1 text-[length:var(--font-size-sm)] font-medium text-[var(--text-primary)]">
          {row.category}
        </span>
        <span className="shrink-0 rounded-full border border-[var(--border-solid)]/60 bg-[var(--surface-alt)]/80 px-1.5 py-0.5 text-[10px] tabular-nums text-[var(--text-muted)]">
          {formatPercent(row.weightPct)}
        </span>
        <span className="shrink-0 text-[10px] tabular-nums text-[var(--text-secondary)]">
          {avgDisplay}
        </span>
        <span className="shrink-0 text-[10px] tabular-nums text-[var(--text-muted)]">
          {row.enteredCount}/{row.assessmentCount}
        </span>
        {remainingLabel ? (
          <span className="shrink-0 text-[10px] font-medium text-[var(--text-muted)]">
            {remainingLabel}
          </span>
        ) : null}
        {!row.locked ? (
          <span className="shrink-0 text-[10px] font-semibold tabular-nums text-[var(--text-tertiary)]">
            {needLabel}
          </span>
        ) : null}
      </div>

      <div
        className="relative mt-2 h-1 w-full overflow-hidden rounded-full"
        role="img"
        aria-label={`${row.category}: scores entered`}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: row.fill, opacity: 0.2 }}
        />
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-300 ease-out"
          style={{
            width: `${row.enteredCount === 0 ? 0 : Math.max(4, Math.min(100, entryPercent))}%`,
            backgroundColor: row.fill,
          }}
        />
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {scores.map((score, scoreIndex) => (
          <ScoreChip
            key={getScoreKey(row.rubricIndex, scores, score, scoreIndex)}
            value={score}
            onRemove={() => onRemoveScore(row.rubricIndex, scoreIndex)}
          />
        ))}
        <ScoreInput
          ariaLabel={`Add score for ${row.category}`}
          placeholder={scoreInputPlaceholder}
          onCommit={(score) => onAddScore(row.rubricIndex, score)}
        />
      </div>
    </div>
  );
};
