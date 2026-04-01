import {
  createDefaultGradePlannerState,
  type GradePlannerState,
} from "@hydrowise/entities";
import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";
import type { CourseRow } from "@/features/dashboard/dashboard-context";
import { CategoryRowList } from "@/features/dashboard/Info/overview/components/grades/components/CategoryRowList";
import { GradeHeader } from "@/features/dashboard/Info/overview/components/grades/components/GradeHeader";
import { WeightProgressBar } from "@/features/dashboard/Info/overview/components/grades/components/WeightProgressBar";
import { useUpdateGradePlannerState } from "@/features/dashboard/Info/overview/components/grades/hooks/useUpdateGradePlannerState";
import { getGradeTrackerPlan } from "@/features/dashboard/Info/overview/components/grades/lib/plan";
import {
  addPlannerScore,
  removePlannerScore,
  setPlannerTargetLetter,
} from "@/features/dashboard/Info/overview/components/grades/lib/planner-state";

type GradeCardProps = {
  course: CourseRow;
};

const GRADE_PANE_CLASS =
  "app-overview-grade-pane flex h-full min-h-0 flex-col overflow-hidden";

const GradePaneShell = ({ children }: { children: ReactNode }) => (
  <section
    className={GRADE_PANE_CLASS}
    aria-labelledby="overview-grade-heading"
  >
    <h2 id="overview-grade-heading" className="sr-only">
      Grade tracker
    </h2>
    {children}
  </section>
);

const emptySyllabusDetail = (hasRubric: boolean, hasScale: boolean): string => {
  if (!hasRubric && !hasScale) {
    return "This course is still missing both the weight buckets and the letter grade scale.";
  }
  if (!hasRubric) {
    return "This course is still missing the grading buckets and weights.";
  }
  return "This course is still missing the letter grade thresholds.";
};

const EmptyGradeState = ({ course }: GradeCardProps) => {
  const hasRubric = course.gradeRubric.length > 0;
  const hasScale = course.gradeScale.length > 0;

  return (
    <GradePaneShell>
      <div className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto px-4 pt-3 pb-3">
        <div className="app-overview-grade-empty-hint">
          <p className="text-[length:var(--type-dashboard-body)] font-semibold text-[var(--text-primary)]">
            Grade planner needs a fuller syllabus breakdown.
          </p>
          <p className="mt-2 text-[length:var(--type-dashboard-label)] leading-relaxed text-[var(--text-secondary)]">
            {emptySyllabusDetail(hasRubric, hasScale)}
          </p>
          <p className="mt-2 text-[length:var(--type-dashboard-label)] leading-relaxed text-[var(--text-secondary)]">
            Once those fields are extracted, this card will save score history
            and show the averages you need in each bucket.
          </p>
        </div>
      </div>
    </GradePaneShell>
  );
};

export const GradeCard = ({ course }: GradeCardProps) => {
  const plannerState: GradePlannerState =
    course.gradePlannerState ?? createDefaultGradePlannerState();

  const savePlannerState = useUpdateGradePlannerState(course.id);

  const plan = getGradeTrackerPlan(
    course.gradeRubric,
    course.gradeScale,
    plannerState,
  );

  const goalCoerceKey = useRef<string | null>(null);
  const coerceCourseIdRef = useRef(course.id);

  useEffect(() => {
    if (coerceCourseIdRef.current !== course.id) {
      coerceCourseIdRef.current = course.id;
      goalCoerceKey.current = null;
    }

    if (!plan) return;

    const persisted = plannerState.selectedGoalLetter;
    if (persisted == null) return;
    if (plan.tiles.some((t) => t.letter === persisted)) {
      goalCoerceKey.current = null;
      return;
    }

    const key = `${course.id}|${persisted}|${plan.targetGrade.letter}`;
    if (goalCoerceKey.current === key) return;
    goalCoerceKey.current = key;

    savePlannerState.mutate(
      setPlannerTargetLetter(plannerState, plan.targetGrade.letter),
    );
  }, [course.id, plan, plannerState, savePlannerState]);

  if (!plan) {
    return <EmptyGradeState course={course} />;
  }

  return (
    <GradePaneShell>
      <div
        className="flex min-h-0 flex-1 flex-col [--assess-chip-fs:var(--type-dashboard-label)] [--assess-chip-h:34px] [--assess-chip-minw:3.25rem] [--assess-chip-pad-x:0.65rem] [--assess-chip-r:11px]"
        style={
          {
            "--cat-accent": "var(--accent)",
          } as CSSProperties
        }
      >
        <div className="shrink-0 border-b border-[color-mix(in_srgb,var(--hairline)_52%,transparent)] bg-[radial-gradient(52%_120%_at_0%_0%,rgba(217,239,222,0.45)_0%,transparent_54%),radial-gradient(48%_120%_at_42%_0%,rgba(240,242,245,0.55)_0%,transparent_46%),radial-gradient(50%_120%_at_74%_0%,rgba(224,234,248,0.45)_0%,transparent_44%),radial-gradient(44%_115%_at_100%_0%,rgba(235,225,247,0.45)_0%,transparent_46%),linear-gradient(180deg,#fcfcfb_0%,#f7f6f4_72%,#f3f2f0_100%)] px-[18px] pt-4 pb-2">
          <GradeHeader
            tiles={plan.tiles}
            selectedLetter={plan.targetGrade.letter}
            plan={plan}
            onSelectLetter={(letter) =>
              savePlannerState.mutate(
                setPlannerTargetLetter(plannerState, letter),
              )
            }
          />
          <div className="mt-0 border-t border-[color-mix(in_srgb,var(--hairline)_78%,transparent)] pt-1.5">
            <WeightProgressBar rows={plan.rows} />
          </div>
        </div>
        <div
          className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-2.5 pb-3.5 [scrollbar-color:color-mix(in_srgb,var(--border-solid)_80%,transparent)_transparent] [mask-image:linear-gradient(to_bottom,#000_calc(100%-20px),transparent)] [-webkit-mask-image:linear-gradient(to_bottom,#000_calc(100%-20px),transparent)] [scrollbar-width:thin]"
          style={{ scrollbarGutter: "stable" }}
        >
          <CategoryRowList
            rows={plan.rows}
            plannerState={plannerState}
            onAddScore={(rubricIndex, score) =>
              savePlannerState.mutate(
                addPlannerScore(plannerState, rubricIndex, score),
              )
            }
            onRemoveScore={(rubricIndex, scoreIndex) =>
              savePlannerState.mutate(
                removePlannerScore(plannerState, rubricIndex, scoreIndex),
              )
            }
          />
        </div>
      </div>
    </GradePaneShell>
  );
};
