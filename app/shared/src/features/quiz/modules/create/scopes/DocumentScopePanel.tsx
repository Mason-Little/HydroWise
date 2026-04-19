import { SelectionPanel } from "@/features/quiz/modules/create/scopes/SelectionPanel";
import { DocumentSelector } from "@/features/quiz/modules/create/selection/DocumentSelector";

type DocumentScopePanelProps = {
  documentIds: string[];
  toggleDocument: (documentId: string) => void;
};

export const DocumentScopePanel = ({
  documentIds,
  toggleDocument,
}: DocumentScopePanelProps) => {
  return (
    <SelectionPanel
      title="Choose documents"
      description="Pick the source documents you want included in this quiz set."
    >
      <DocumentSelector
        documentIds={documentIds}
        toggleDocument={toggleDocument}
      />
    </SelectionPanel>
  );
};
