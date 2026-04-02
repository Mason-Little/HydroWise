import type { Document } from "@hydrowise/entities";
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DocumentViewerHeader } from "@/features/document-viewer/components/DocumentViewerHeader";
import { DocumentViewerStage } from "@/features/document-viewer/components/DocumentViewerStage";

type DocumentViewerProps = {
  document: Document;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const DocumentViewer = ({
  document,
  open,
  setOpen,
}: DocumentViewerProps) => {
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    if (open) {
      setPageNumber(1);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex h-[94vh] w-[96vw] max-w-[1100px] flex-col gap-0 overflow-hidden rounded-[var(--app-radius-workspace)] border border-[color-mix(in_srgb,var(--app-border-solid)_28%,transparent)] bg-[var(--app-surface-primary)] p-0 text-[var(--app-text-primary)] shadow-[var(--app-shadow-lift)] ring-[color-mix(in_srgb,var(--app-border-solid)_22%,transparent)] sm:max-w-[1100px]">
        <div className="flex h-full min-h-0 flex-col">
          <DocumentViewerHeader documentTitle={document.name} />
          <DocumentViewerStage
            document={document}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            totalPages={document.totalPages}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
