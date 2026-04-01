import type { GradePlannerState } from "@hydrowise/entities";
import { CompactCategoryRow } from "@/features/dashboard/Info/overview/components/grades/components/CategoryRow";
import type { GradeTrackerRow } from "@/features/dashboard/Info/overview/components/grades/lib/types";

type CategoryRowListProps = {
  onAddScore: (rubricIndex: string, score: number) => void;
  onRemoveScore: (rubricIndex: string, scoreIndex: number) => void;
  plannerState: GradePlannerState;
  rows: GradeTrackerRow[];
};

export const CategoryRowList = ({
  onAddScore,
  onRemoveScore,
  plannerState,
  rows,
}: CategoryRowListProps) => (
  <div className="flex flex-col gap-0">
    {rows.map((row, index) => (
      <CompactCategoryRow
        key={row.rubricIndex}
        categoryIndex={index}
        row={row}
        plannerState={plannerState}
        onAddScore={onAddScore}
        onRemoveScore={onRemoveScore}
      />
    ))}
  </div>
);
