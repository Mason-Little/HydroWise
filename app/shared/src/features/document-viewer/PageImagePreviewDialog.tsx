import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DocumentViewerHeader } from "@/features/document-viewer/components/DocumentViewerHeader";
import { usePageById } from "@/features/document-viewer/hooks/usePageById";
import { usePageImageUrl } from "@/features/document-viewer/hooks/usePageImageUrl";
import { cn } from "@/lib/utils";

type PageImagePreviewDialogProps = {
  pageId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const PageImagePreviewDialog = ({
  pageId,
  open,
  onOpenChange,
}: PageImagePreviewDialogProps) => {
  const { data: page, isLoading } = usePageById(pageId, open);
  const imageUrl = usePageImageUrl(page);

  const pageBody =
    isLoading && !page ? (
      <div className="text-sm text-[var(--app-text-muted)]">Loading...</div>
    ) : !page ? (
      <div className="text-sm text-[var(--app-text-muted)]">No page found</div>
    ) : !imageUrl ? (
      <div className="text-sm text-[var(--app-text-muted)]">No image found</div>
    ) : (
      <img
        src={imageUrl}
        alt={`Page ${page.pageNumber}`}
        className="max-h-full max-w-full object-contain"
      />
    );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[94vh] w-[96vw] max-w-[1100px] flex-col gap-0 overflow-hidden rounded-[var(--app-radius-workspace)] border border-[color-mix(in_srgb,var(--app-border-solid)_28%,transparent)] bg-[var(--app-surface-primary)] p-0 text-[var(--app-text-primary)] shadow-[var(--app-shadow-lift)] ring-[color-mix(in_srgb,var(--app-border-solid)_22%,transparent)] sm:max-w-[1100px]">
        <div className="flex h-full min-h-0 flex-col">
          <DocumentViewerHeader documentTitle="Source page" />
          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="flex min-h-0 flex-1 bg-[var(--app-surface-secondary)] px-1 pt-1 pb-3 sm:px-2">
              {/* Match DocumentViewerStage gutters; no prev/next for a single cited page */}
              <div className="w-11 shrink-0 sm:w-12" aria-hidden />
              <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden p-2">
                <div
                  className={cn(
                    "flex max-h-full max-w-full items-center justify-center rounded-[var(--app-radius-workspace)] border p-2 sm:p-3",
                    "border-[color-mix(in_srgb,var(--app-border-solid)_35%,transparent)] bg-[var(--app-surface-primary)]",
                    "shadow-[var(--app-shadow-lift)]",
                  )}
                >
                  {pageBody}
                </div>
              </div>
              <div className="w-11 shrink-0 sm:w-12" aria-hidden />
            </div>
            {page ? (
              <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
                <div
                  className={cn(
                    "pointer-events-auto rounded-full border px-3 py-1 text-xs text-[var(--app-text-muted)]",
                    "border-[color-mix(in_srgb,var(--app-border-solid)_30%,transparent)]",
                    "bg-[color-mix(in_srgb,var(--app-surface-primary)_92%,transparent)] shadow-[var(--app-shadow-soft)] backdrop-blur-sm",
                  )}
                >
                  Page {page.pageNumber}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
