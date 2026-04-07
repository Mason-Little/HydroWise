import { CommandList, CommandSeparator } from "@/components/ui/command";
import {
  FeatureCommandSection,
  SyllabusDocumentUploadSection,
} from "@/features/app-toolbar/actions/sections";

type ToolbarCommandMenuProps = {
  searchQuery: string;
  onDismiss: () => void;
};

export function ToolbarCommandMenu({
  searchQuery,
  onDismiss,
}: ToolbarCommandMenuProps) {
  return (
    <CommandList
      id="app-action-results"
      className="max-h-[min(420px,70vh)] scroll-py-0 py-2"
    >
      <FeatureCommandSection searchQuery={searchQuery} onDismiss={onDismiss} />
      <CommandSeparator className="mx-3 my-2 bg-[var(--app-hairline)]" />
      <SyllabusDocumentUploadSection />
    </CommandList>
  );
}
