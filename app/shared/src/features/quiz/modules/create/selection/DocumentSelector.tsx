import type { Dispatch, SetStateAction } from "react";
import { useDocumentsByCourse } from "@/domains/material/hooks/useDocuments";
import { useDashboardContext } from "@/features/dashboard/dashboard-context";
import type { CreateQuizSelection } from "@/features/quiz/modules/create/context/create-quiz-context";
import { SelectableTile } from "@/features/quiz/modules/create/selection/SelectableTile";

type DocumentSelectorProps = {
  documentIds: string[];
  setSelection: Dispatch<SetStateAction<CreateQuizSelection>>;
};

export const DocumentSelector = ({
  documentIds,
  setSelection,
}: DocumentSelectorProps) => {
  const { activeCourse } = useDashboardContext();
  const { documents } = useDocumentsByCourse(activeCourse.id);

  return (
    <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
      {documents.map((document) => {
        const selected = documentIds.includes(document.id);
        const onSelect = () => {
          setSelection({
            scope: "document",
            documentIds: selected
              ? documentIds.filter((id) => id !== document.id)
              : [...documentIds, document.id],
          });
        };

        return (
          <SelectableTile
            key={document.id}
            selected={selected}
            onSelect={onSelect}
            title={document.name}
            description={document.description}
          />
        );
      })}
    </div>
  );
};
