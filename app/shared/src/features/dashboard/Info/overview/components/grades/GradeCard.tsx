import {
  createDefaultGradePlannerState,
  type GradePlannerState,
} from "@hydrowise/entities";
import { useEffect, useRef } from "react";
import type { CourseRow } from "@/features/dashboard/Dashboard";
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
import { OverviewSectionCard } from "@/features/dashboard/Info/overview/components/OverviewSectionCard";

type GradeCardProps = {
  course: CourseRow;
};

const EmptyGradeState = ({ course }: GradeCardProps) => {
  const hasRubric = course.gradeRubric.length > 0;
  const hasScale = course.gradeScale.length > 0;

  return (
    <OverviewSectionCard
      title="Grade tracker"
      className="flex h-full min-h-0 flex-col justify-center overflow-y-auto"
    >
      <div className="rounded-[var(--hw-radius-xl)] border border-dashed border-[var(--border-solid)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface-alt)_86%,white),var(--surface))] p-4">
        <p className="text-sm font-semibold text-[var(--text-primary)]">
          Grade planner needs a fuller syllabus breakdown.
        </p>
        <p className="mt-2 text-[length:var(--font-size-sm)] leading-relaxed text-[var(--text-secondary)]">
          {!hasRubric && !hasScale
            ? "This course is still missing both the weight buckets and the letter grade scale."
            : !hasRubric
              ? "This course is still missing the grading buckets and weights."
              : "This course is still missing the letter grade thresholds."}
        </p>
        <p className="mt-2 text-[length:var(--font-size-sm)] leading-relaxed text-[var(--text-secondary)]">
          Once those fields are extracted, this card will save score history and
          show the averages you need in each bucket.
        </p>
      </div>
    </OverviewSectionCard>
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

  const persistPlannerState = (nextPlannerState: GradePlannerState) => {
    savePlannerState.mutate(nextPlannerState);
  };

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
    <OverviewSectionCard
      title="Grade tracker"
      className="flex h-full min-h-0 flex-col gap-2.5"
    >
      <div className="shrink-0 space-y-2.5">
        <GradeHeader
          tiles={plan.tiles}
          selectedLetter={plan.targetGrade.letter}
          plan={plan}
          onSelectLetter={(letter) =>
            persistPlannerState(setPlannerTargetLetter(plannerState, letter))
          }
        />
        <WeightProgressBar rows={plan.rows} />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto pr-0.5">
        <CategoryRowList
          rows={plan.rows}
          plannerState={plannerState}
          onAddScore={(rubricIndex, score) =>
            persistPlannerState(
              addPlannerScore(plannerState, rubricIndex, score),
            )
          }
          onRemoveScore={(rubricIndex, scoreIndex) =>
            persistPlannerState(
              removePlannerScore(plannerState, rubricIndex, scoreIndex),
            )
          }
        />
      </div>
    </OverviewSectionCard>
  );
};
