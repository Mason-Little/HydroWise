import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type DocumentViewerHeaderProps = {
  documentTitle: string;
};

export const DocumentViewerHeader = ({
  documentTitle,
}: DocumentViewerHeaderProps) => (
  <DialogHeader
    className={cn(
      "app-workspace-shell__header shrink-0 gap-0 pr-10 text-left sm:text-left",
    )}
  >
    <DialogTitle className="truncate text-sm font-semibold text-[var(--app-text-primary)]">
      {documentTitle}
    </DialogTitle>
  </DialogHeader>
);
