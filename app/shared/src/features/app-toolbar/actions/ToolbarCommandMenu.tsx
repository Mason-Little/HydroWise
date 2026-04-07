import { CommandList, CommandSeparator } from "@/components/ui/command";
import {
  FeatureCommandSection,
  SyllabusDocumentUploadSection,
  ThreadCommandSection,
} from "@/features/app-toolbar/actions/sections";

type ToolbarCommandMenuProps = {
  searchQuery: string;
  onDismiss: () => void;
};

const toolbarCommandSeparatorClassName = "mx-3 my-2 bg-[var(--app-hairline)]";

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
      <CommandSeparator className={toolbarCommandSeparatorClassName} />
      <ThreadCommandSection searchQuery={searchQuery} onDismiss={onDismiss} />
      <CommandSeparator className={toolbarCommandSeparatorClassName} />
      <SyllabusDocumentUploadSection />
    </CommandList>
  );
}
