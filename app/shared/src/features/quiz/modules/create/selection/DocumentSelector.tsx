import { FileText } from "lucide-react";
import { useDocumentsByCourse } from "@/domains/material/hooks/useDocuments";
import { useDashboardContext } from "@/features/dashboard/dashboard-context";
import { SelectableTile } from "@/features/quiz/modules/create/selection/SelectableTile";

type DocumentSelectorProps = {
  documentIds: string[];
  toggleDocument: (documentId: string) => void;
};

export const DocumentSelector = ({
  documentIds,
  toggleDocument,
}: DocumentSelectorProps) => {
  const { activeCourse } = useDashboardContext();
  const { documents } = useDocumentsByCourse(activeCourse.id);

  if (documents.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center py-8">
        <div className="mx-auto flex max-w-sm flex-col items-center text-center">
          <div className="mb-3 flex size-10 items-center justify-center rounded-xl border border-border/60 bg-[var(--app-surface-secondary)] text-[var(--app-text-tertiary)]">
            <FileText className="size-4" aria-hidden />
          </div>
          <p className="text-[0.92rem] font-semibold text-[var(--app-text-primary)]">
            No documents yet
          </p>
          <p className="mt-1 text-[0.8rem] leading-5 text-[var(--app-text-muted)]">
            Upload course material to build quizzes from individual documents.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-2.5 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
      {documents.map((document) => {
        const selected = documentIds.includes(document.id);

        return (
          <SelectableTile
            key={document.id}
            selected={selected}
            onSelect={() => toggleDocument(document.id)}
            title={document.name}
            description={document.description}
          />
        );
      })}
    </div>
  );
};
