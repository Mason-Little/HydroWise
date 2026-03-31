import { formatPercent } from "@/features/dashboard/Info/overview/components/grades/lib/format";
import { pillRampForGoalTile } from "@/features/dashboard/Info/overview/components/grades/lib/targetGradePillRamp";
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

const STATUS_LABEL: Record<Exclude<GradeTrackerStatus, "idle">, string> = {
  comfortable: "Comfortable",
  stretch: "Stretch",
  aggressive: "Aggressive",
  impossible: "Impossible",
};

const STATUS_DOT: Record<Exclude<GradeTrackerStatus, "idle">, string> = {
  comfortable: "var(--green)",
  stretch: "#d97706",
  aggressive: "#ea580c",
  impossible: "#dc2626",
};

export const GradeHeader = ({
  onSelectLetter,
  plan,
  selectedLetter,
  tiles,
}: GradeHeaderProps) => {
  const statusLabel = plan.status !== "idle" ? STATUS_LABEL[plan.status] : null;
  const statusDot = plan.status !== "idle" ? STATUS_DOT[plan.status] : null;
  const letterDisplay = plan.currentLetter ?? "—";
  const pctDisplay =
    plan.currentGradePct !== null ? formatPercent(plan.currentGradePct) : "—";

  return (
    <div className="relative">
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-1 gap-y-3 pb-1.5 min-[640px]:grid-cols-[minmax(0,auto)_minmax(0,1fr)] min-[640px]:items-center min-[640px]:gap-x-[22px] min-[640px]:gap-y-3">
          <div className="flex w-full max-w-[min(19.5rem,100%)] flex-col items-start gap-0 border-[color-mix(in_srgb,var(--hairline)_72%,transparent)] pr-0 min-[640px]:w-max min-[640px]:max-w-[min(19.5rem,100%)] min-[640px]:shrink-0 min-[640px]:border-r min-[640px]:pr-[18px]">
            <div className="flex min-w-0 flex-col gap-0">
              <span className="mb-1 text-[length:var(--type-dashboard-micro)] font-semibold tracking-normal text-[#5d6f79]">
                Current grade
              </span>
              <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
                <span className="font-display text-[clamp(2.45rem,5vw,3.15rem)] font-bold leading-none tracking-[-0.045em] text-[var(--text-primary)]">
                  {letterDisplay}
                </span>
                <span className="text-[length:var(--type-dashboard-grade-pct)] font-bold tracking-[-0.03em] text-[#2f4a40] tabular-nums">
                  {pctDisplay}
                </span>
                {statusLabel && statusDot ? (
                  <span className="inline-flex h-[2.125rem] shrink-0 items-center gap-1.5 self-center rounded-[var(--hw-radius-lg)] border border-[#bfd5c4] bg-[linear-gradient(180deg,#edf6ef_0%,#dff0e4_100%)] px-2.5 text-[length:var(--type-dashboard-micro)] font-semibold tracking-[0.01em] text-[#42584c]">
                    <span
                      className="size-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: statusDot }}
                      aria-hidden
                    />
                    {statusLabel}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-col items-end gap-1.5 min-[640px]:pt-0">
            <span className="mb-0 block w-full text-right text-[length:var(--type-dashboard-micro)] font-semibold tracking-normal text-[#5d6f79]">
              Set your target
            </span>
            <fieldset className="m-0 w-full min-w-0 border-0 p-0">
              <legend className="sr-only">Target letter grade</legend>
              <div className="flex min-w-0 flex-wrap items-center justify-end gap-x-[11px] gap-y-2.5 min-[640px]:flex-nowrap min-[640px]:gap-y-0">
                {tiles.map((tile, index) => {
                  const isSelected = selectedLetter === tile.letter;
                  const ramp = pillRampForGoalTile(index, tiles.length);
                  const palette = isSelected ? ramp.active : ramp.idle;

                  return (
                    <button
                      key={`${tile.letter}-${tile.min}`}
                      type="button"
                      aria-pressed={isSelected}
                      title={`${tile.letter} · ${tile.min}% minimum`}
                      onClick={() => onSelectLetter(tile.letter)}
                      className="inline-flex h-[2.4rem] w-[3.2rem] shrink-0 items-center justify-center rounded-[var(--hw-radius-lg)] border border-solid text-[length:var(--type-dashboard-label)] font-semibold tabular-nums transition-[background-color,border-color,color,box-shadow] duration-150 ease-out [box-shadow:inset_0_1px_0_rgba(255,255,255,0.62)] hover:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.72),0_1px_3px_rgba(37,50,58,0.05)]"
                      style={{
                        backgroundColor: palette.backgroundColor,
                        borderColor: palette.borderColor,
                        color: palette.color,
                      }}
                    >
                      {tile.letter}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  );
};
