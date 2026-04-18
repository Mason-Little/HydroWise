import type { Document } from "@hydrowise/entities";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useDocumentPage } from "@/features/document-viewer/hooks/useDocumentPage";
import { usePageImageUrl } from "@/features/document-viewer/hooks/usePageImageUrl";
import { cn } from "@/lib/utils";

type DocumentViewerStageProps = {
  document: Document;
  pageNumber: number;
  totalPages: number;
  setPageNumber: (pageNumber: number) => void;
};

const navButtonClass = cn(
  "inline-flex size-9 shrink-0 items-center justify-center rounded-full outline-none transition-[background-color,box-shadow,transform] duration-150 ease-out",
  "bg-[color-mix(in_srgb,var(--app-surface-primary)_88%,var(--app-workspace-bg))] text-[var(--app-text-primary)] shadow-md ring-1 ring-black/5",
  "hover:bg-[var(--app-surface-primary)] hover:shadow-lg hover:ring-black/10 active:scale-[0.97]",
  "disabled:pointer-events-none disabled:opacity-35",
  "[&_svg]:size-3.5",
);

export const DocumentViewerStage = ({
  document,
  pageNumber,
  totalPages,
  setPageNumber,
}: DocumentViewerStageProps) => {
  const { page, isLoading } = useDocumentPage(
    document.id,
    pageNumber,
    totalPages,
  );
  const imageUrl = usePageImageUrl(page ?? null);

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
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 bg-[var(--app-surface-secondary)] px-1 pt-1 pb-3 sm:px-2">
        <div className="flex w-11 shrink-0 items-center justify-center sm:w-12">
          <button
            type="button"
            className={navButtonClass}
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber(pageNumber - 1)}
          >
            <ChevronLeftIcon />
            <span className="sr-only">Previous page</span>
          </button>
        </div>
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
        <div className="flex w-11 shrink-0 items-center justify-center sm:w-12">
          <button
            type="button"
            className={navButtonClass}
            disabled={pageNumber >= totalPages}
            onClick={() => setPageNumber(pageNumber + 1)}
          >
            <ChevronRightIcon />
            <span className="sr-only">Next page</span>
          </button>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
        <div
          className={cn(
            "pointer-events-auto rounded-full border px-3 py-1 text-xs text-[var(--app-text-muted)]",
            "border-[color-mix(in_srgb,var(--app-border-solid)_30%,transparent)]",
            "bg-[color-mix(in_srgb,var(--app-surface-primary)_92%,transparent)] shadow-[var(--app-shadow-soft)] backdrop-blur-sm",
          )}
        >
          Page {pageNumber} of {totalPages}
        </div>
      </div>
    </div>
  );
};
