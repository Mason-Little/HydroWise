import { getWeightStatus } from "@/features/dashboard/Info/overview/components/grades/lib/copy";
import type {
  GoalGradeTile,
  GradeTrackerPlan,
  GradeTrackerStatus,
} from "@/features/dashboard/Info/overview/components/grades/lib/types";

type GradeHeaderProps = {
  onSelectLetter: (letter: string) => void;
  plan: GradeTrackerPlan;
  selectedLetter: string;
  tiles: GoalGradeTile[];
};

const STATUS_DOT_COLOR: Record<Exclude<GradeTrackerStatus, "idle">, string> = {
  comfortable: "var(--green)",
  stretch: "#d97706",
  aggressive: "#ea580c",
  impossible: "#dc2626",
};

const STATUS_LABEL: Record<Exclude<GradeTrackerStatus, "idle">, string> = {
  comfortable: "Comfortable",
  stretch: "Stretch",
  aggressive: "Aggressive",
  impossible: "Impossible",
};

export const GradeHeader = ({
  onSelectLetter,
  plan,
  selectedLetter,
  tiles,
}: GradeHeaderProps) => {
  const currentGradeLabel = getWeightStatus(plan);
  const statusDotColor =
    plan.status !== "idle" ? STATUS_DOT_COLOR[plan.status] : null;
  const statusLabel =
    plan.status !== "idle" ? STATUS_LABEL[plan.status] : null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-[var(--hw-radius-xl)] bg-[var(--surface-alt)]/60 px-3 py-2">
      <div className="flex min-w-0 flex-wrap items-center gap-1.5">
        <span className="shrink-0 text-[10px] font-semibold tracking-[0.18em] text-[var(--text-tertiary)] uppercase">
          Goal
        </span>
        <fieldset className="m-0 flex flex-wrap gap-1 border-0 p-0">
          <legend className="sr-only">Goal letter grade</legend>
          {tiles.map((tile) => {
            const isSelected = selectedLetter === tile.letter;
            const activeBg = `color-mix(in srgb, ${tile.backgroundColor} 88%, black)`;

            return (
              <button
                key={`${tile.letter}-${tile.min}`}
                type="button"
                aria-pressed={isSelected}
                title={`${tile.letter} · ${tile.min}% minimum`}
                onClick={() => onSelectLetter(tile.letter)}
                className="flex h-5 min-w-[1.75rem] items-center justify-center rounded-full px-1.5 text-[9.5px] font-semibold text-[var(--text-primary)] transition-[background-color,border-color,box-shadow] hover:brightness-[0.97]"
                style={
                  isSelected
                    ? {
                        backgroundColor: activeBg,
                        border: `1px solid color-mix(in srgb, ${tile.backgroundColor} 68%, black)`,
                        boxShadow: "0 1px 3px rgb(0 0 0 / 0.2)",
                      }
                    : {
                        backgroundColor: tile.backgroundColor,
                        border: `1px solid color-mix(in srgb, ${tile.backgroundColor} 82%, black)`,
                        boxShadow: "0 1px 3px rgb(0 0 0 / 0.1)",
                      }
                }
              >
                {tile.letter}
              </button>
            );
          })}
        </fieldset>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {statusDotColor && statusLabel ? (
          <div className="flex items-center gap-1.5">
            <span
              className="size-1.5 rounded-full"
              style={{ backgroundColor: statusDotColor }}
              aria-hidden
            />
            <span className="text-[10px] font-semibold text-[var(--text-secondary)]">
              {statusLabel}
            </span>
          </div>
        ) : null}
        {currentGradeLabel ? (
          <span className="rounded-full border border-[var(--green-border)] bg-[var(--green-bg)] px-2 py-0.5 text-[10px] font-semibold tracking-[0.12em] text-[var(--green)] uppercase">
            {currentGradeLabel}
          </span>
        ) : null}
      </div>
    </div>
  );
};
