import { AnimatePresence } from "framer-motion";
import { ActionBar } from "./ActionBar";
import { AddMoreCard } from "./AddMoreCard";
import { EmptyDropZone } from "./EmptyDropZone";
import { FileCard } from "./FileCard";

interface ExpandedViewProps {
  files: File[];
  onRemoveFile: (name: string) => void;
  onAddMore: () => void;
  onUpload: () => void;
}

export const ExpandedView = ({
  files,
  onRemoveFile,
  onAddMore,
  onUpload,
}: ExpandedViewProps) => {
  const hasFiles = files.length > 0;

  return (
    <div className="flex w-full flex-wrap items-stretch gap-3 py-1">
      <AnimatePresence>
        {files.map((file) => (
          <FileCard
            key={file.name}
            file={file}
            onRemove={() => onRemoveFile(file.name)}
          />
        ))}
      </AnimatePresence>

      {hasFiles ? <AddMoreCard onClick={onAddMore} /> : <EmptyDropZone />}
      {hasFiles ? (
        <ActionBar fileCount={files.length} onUpload={onUpload} />
      ) : null}
    </div>
  );
};
