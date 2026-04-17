import { useDocumentsByCourse } from "@/domains/material/hooks/useDocuments";
import { useDashboardContext } from "@/features/dashboard/dashboard-context";
import { useCreateQuizContext } from "@/features/quiz/modules/create/context/create-quiz-context";
import { SelectableTile } from "@/features/quiz/modules/create/selection/SelectableTile";

export const DocumentSelector = () => {
  const { activeCourse } = useDashboardContext();

  if (!activeCourse) {
    return null;
  }

  return <DocumentSelectorContent courseId={activeCourse.id} />;
};

const DocumentSelectorContent = ({ courseId }: { courseId: string }) => {
  return <DocumentSelectorList courseId={courseId} />;
};

const DocumentSelectorList = ({ courseId }: { courseId: string }) => {
  const { documents } = useDocumentsByCourse(courseId);
  const { selectedDocumentIds, setSelectedDocumentIds } =
    useCreateQuizContext();

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {documents.map((document) => {
        const selected = selectedDocumentIds.includes(document.id);
        const onSelect = () => {
          setSelectedDocumentIds(
            selected
              ? selectedDocumentIds.filter((id) => id !== document.id)
              : [...selectedDocumentIds, document.id],
          );
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
