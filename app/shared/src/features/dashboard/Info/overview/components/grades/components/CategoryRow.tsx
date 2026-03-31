import type { GradePlannerState } from "@hydrowise/entities";
import { type CSSProperties, useState } from "react";
import { ScoreChip } from "@/features/dashboard/Info/overview/components/grades/components/ScoreChip";
import { ScoreInput } from "@/features/dashboard/Info/overview/components/grades/components/ScoreInput";
import {
  getCategoryProgressLabel,
  getGhostSuggestionScore,
} from "@/features/dashboard/Info/overview/components/grades/lib/copy";
import { formatPercent } from "@/features/dashboard/Info/overview/components/grades/lib/format";
import { getPlannerScores } from "@/features/dashboard/Info/overview/components/grades/lib/planner-state";
import type { GradeTrackerRow } from "@/features/dashboard/Info/overview/components/grades/lib/types";
import { cn } from "@/lib/utils";

type CompactCategoryRowProps = {
  categoryIndex: number;
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
  categoryIndex,
  onAddScore,
  onRemoveScore,
  plannerState,
  row,
}: CompactCategoryRowProps) => {
  const scores = getPlannerScores(plannerState, row.rubricIndex);
  const progressLabel = getCategoryProgressLabel(row);
  const ghostScore = getGhostSuggestionScore(row);
  const showNeutralAdd = ghostScore === null;
  const dataCat = categoryIndex % 6;

  const [isEditing, setIsEditing] = useState(false);
  const [scoreHint, setScoreHint] = useState<number | null>(null);
  const [addSession, setAddSession] = useState(0);

  const openEditor = (hint: number | null) => {
    setAddSession((n) => n + 1);
    setScoreHint(hint);
    setIsEditing(true);
  };

  const dismissAdd = () => {
    setIsEditing(false);
    setScoreHint(null);
  };

  const commitAdd = (score: number) => {
    onAddScore(row.rubricIndex, score);
    dismissAdd();
  };

  const chipAccentStyle = {
    "--chip-accent": row.fill,
  } as CSSProperties;

  const inputPlaceholder = scoreHint !== null ? String(scoreHint) : "";

  const progressBadgeClassName =
    progressLabel === "Complete"
      ? "inline-flex items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--green)_28%,var(--border-solid))] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_82%,var(--green-bg)_18%)_0%,color-mix(in_srgb,var(--surface)_74%,var(--green-bg)_26%)_100%)] px-2 py-0.5 text-[11px] font-semibold tracking-[-0.012em] text-[color-mix(in_srgb,var(--green)_32%,var(--course-accent-strong))] tabular-nums [box-shadow:inset_0_1px_0_rgba(255,255,255,0.75)]"
      : "inline-flex items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--cat-accent)_30%,var(--border-solid))] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_80%,var(--cat-accent)_14%)_0%,color-mix(in_srgb,var(--surface)_72%,var(--cat-accent)_18%)_100%)] px-2 py-0.5 text-[11px] font-semibold tracking-[-0.012em] text-[color-mix(in_srgb,var(--cat-accent)_38%,var(--text-primary))] tabular-nums [box-shadow:inset_0_1px_0_rgba(255,255,255,0.72)]";

  return (
    <div
      className="-mx-1.5 flex flex-col gap-1.5 rounded-[var(--hw-radius-lg)] border-b border-[color-mix(in_srgb,var(--hairline)_88%,transparent)] bg-[color-mix(in_srgb,var(--surface-alt)_18%,transparent)] px-2.5 py-2 last:border-b-0 last:pb-1"
      data-cat={dataCat}
      style={
        {
          "--cat-accent": row.fill,
        } as CSSProperties
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-x-2.5 gap-y-1.5">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full bg-[color-mix(in_srgb,var(--text-tertiary)_38%,var(--border-solid))]"
            aria-hidden
          />
          <span className="min-w-0 truncate text-[length:var(--font-size-sm)] font-semibold text-[var(--text-primary)]">
            {row.category}
          </span>
        </div>
        <fieldset className="m-0 flex max-w-[min(100%,22rem)] shrink-0 flex-wrap items-center justify-end gap-1 border-0 p-0">
          <legend className="sr-only">Weight, average, and progress</legend>
          <span className="inline-flex items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--cat-accent)_14%,var(--border-solid))] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_94%,var(--cat-accent)_5%)_0%,color-mix(in_srgb,var(--surface-alt)_90%,var(--cat-accent)_4%)_100%)] px-2 py-0.5 text-[11px] font-semibold tracking-[-0.012em] text-[color-mix(in_srgb,var(--text-tertiary)_16%,var(--text-primary))] tabular-nums [box-shadow:inset_0_1px_0_rgba(255,255,255,0.78)]">
            {formatPercent(row.weightPct)}
          </span>
          {row.averagePct !== null ? (
            <>
              <span className="inline-flex items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--accent)_10%,var(--border-solid))] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_93%,var(--course-accent-soft)_14%)_0%,color-mix(in_srgb,var(--surface)_88%,var(--course-accent-soft)_10%)_100%)] px-2 py-0.5 text-[11px] font-semibold tracking-[-0.012em] text-[color-mix(in_srgb,var(--text-primary)_92%,var(--accent)_6%)] tabular-nums [box-shadow:inset_0_1px_0_rgba(255,255,255,0.82)]">
                {`avg ${Math.round(row.averagePct)}`}
              </span>
              <span className={progressBadgeClassName}>
                {progressLabel}
              </span>
            </>
          ) : (
            <span className="inline-flex items-center justify-center rounded-full border border-dashed border-[color-mix(in_srgb,var(--cat-accent)_12%,var(--border-solid))] bg-[color-mix(in_srgb,var(--surface)_95%,var(--cat-accent)_3%)] px-2 py-0.5 text-[11px] font-semibold text-[color-mix(in_srgb,var(--cat-accent)_10%,var(--text-tertiary))] tabular-nums [box-shadow:inset_0_1px_0_rgba(255,255,255,0.65)]">
              No grades yet
            </span>
          )}
        </fieldset>
      </div>

      <div className="flex flex-col gap-0">
        <div className="flex flex-wrap items-center gap-1.5">
          {scores.map((score, scoreIndex) => (
            <ScoreChip
              key={getScoreKey(row.rubricIndex, scores, score, scoreIndex)}
              accent={row.fill}
              value={score}
              onRemove={() => onRemoveScore(row.rubricIndex, scoreIndex)}
            />
          ))}
          {!isEditing && ghostScore !== null ? (
            <button
              type="button"
              className="inline-flex h-[var(--assess-chip-h)] w-[var(--assess-chip-minw)] min-w-[var(--assess-chip-minw)] shrink-0 items-center justify-center rounded-[var(--assess-chip-r)] border border-dashed border-[color-mix(in_srgb,var(--cat-accent)_22%,var(--border-solid))] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_96%,var(--cat-accent)_4%)_0%,color-mix(in_srgb,var(--surface)_92%,var(--cat-accent)_6%)_100%)] px-[var(--assess-chip-pad-x)] text-[length:var(--assess-chip-fs)] font-semibold tabular-nums text-[color-mix(in_srgb,var(--cat-accent)_22%,var(--text-tertiary))] transition-[border-color,background-color,color] hover:border-[color-mix(in_srgb,var(--cat-accent)_32%,var(--border-solid))] hover:bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_93%,var(--cat-accent)_7%)_0%,color-mix(in_srgb,var(--surface)_88%,var(--cat-accent)_9%)_100%)] hover:text-[color-mix(in_srgb,var(--cat-accent)_18%,var(--text-secondary))] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.7)]"
              title={`Suggested around ${ghostScore} — click to type your score`}
              aria-label={`Add score for ${row.category}, planner suggests about ${ghostScore}`}
              onClick={() => openEditor(ghostScore)}
            >
              {ghostScore}
            </button>
          ) : null}
          {!isEditing && showNeutralAdd ? (
            <button
              type="button"
              aria-label={`Add score for ${row.category}`}
              style={chipAccentStyle}
              className={cn(
                "inline-flex h-[var(--assess-chip-h)] w-[var(--assess-chip-minw)] min-w-[var(--assess-chip-minw)] shrink-0 items-center justify-center rounded-[var(--assess-chip-r)] border border-solid border-[color-mix(in_srgb,var(--chip-accent)_26%,var(--border-solid))] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_95%,var(--chip-accent)_7%)_0%,color-mix(in_srgb,var(--surface)_88%,var(--chip-accent)_11%)_100%)] px-[var(--assess-chip-pad-x)] text-[length:var(--assess-chip-fs)] font-semibold leading-none text-[color-mix(in_srgb,var(--chip-accent)_40%,var(--course-accent-strong))] outline-none transition-[border-color,box-shadow,background] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.82),0_1px_2px_rgba(37,50,58,0.04)] hover:border-[color-mix(in_srgb,var(--chip-accent)_38%,var(--border-solid))] hover:bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_92%,var(--chip-accent)_9%)_0%,color-mix(in_srgb,var(--surface)_84%,var(--chip-accent)_14%)_100%)]",
              )}
              onClick={() => openEditor(null)}
            >
              +
            </button>
          ) : null}
          {isEditing ? (
            <ScoreInput
              key={`${row.rubricIndex}-add-${addSession}`}
              accent={row.fill}
              ariaLabel={`Enter score for ${row.category}${scoreHint !== null ? ` (hint ${scoreHint})` : ""}`}
              autoFocus
              placeholder={inputPlaceholder}
              onCommit={commitAdd}
              onDismiss={dismissAdd}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};
