import type { Document } from "@hydrowise/entities";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DocumentViewer } from "@/features/document-viewer/DocumentViewer";
import { cn } from "@/lib/utils";

type MaterialDocumentTileProps = {
  document: Document;
};

export const MaterialDocumentTile = ({
  document,
}: MaterialDocumentTileProps) => {
  const desc = document.description.trim();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        aria-label={`Open document: ${document.name}`}
        onClick={() => setOpen(true)}
        className={cn(
          "h-auto min-h-20 w-full cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] gap-3 rounded-xl border px-3 py-3 text-left font-[inherit] text-inherit whitespace-normal",
          "grid items-center justify-start border-[color-mix(in_srgb,var(--app-border-solid)_28%,transparent)] bg-[var(--app-surface-primary)]",
          "transition-[border-color,background-color] duration-150 ease-out",
          "hover:border-[color-mix(in_srgb,var(--course-accent-ring)_35%,var(--app-border-solid))]",
          "hover:bg-[color-mix(in_srgb,var(--course-accent-soft)_22%,var(--app-surface-primary))]",
        )}
      >
        <div
          className={cn(
            "relative h-14 w-11 shrink-0 overflow-hidden rounded-lg border",
            "border-[color-mix(in_srgb,var(--app-border-solid)_35%,transparent)]",
            "bg-[color-mix(in_srgb,var(--app-workspace-bg)_40%,var(--app-surface-primary))]",
          )}
          aria-hidden={true}
        >
          <span className="absolute left-2 right-2 top-3 grid gap-1">
            <span className="h-0.5 rounded-full bg-[color-mix(in_srgb,var(--course-accent-strong)_20%,transparent)]" />
            <span className="h-0.5 rounded-full bg-[color-mix(in_srgb,var(--course-accent-strong)_20%,transparent)]" />
            <span className="h-0.5 w-[65%] rounded-full bg-[color-mix(in_srgb,var(--course-accent-strong)_20%,transparent)]" />
          </span>
        </div>
        <div className="min-w-0">
          <span
            className={cn(
              "mb-0.5 block text-[10px] font-bold uppercase tracking-wide",
              "text-[var(--app-text-tertiary)]",
            )}
          >
            Document
          </span>
          <span
            className={cn(
              "block text-sm font-semibold leading-snug",
              "text-[var(--app-text-primary)]",
            )}
          >
            {document.name}
          </span>
          {desc ? (
            <span
              className={cn(
                "mt-0.5 block text-xs leading-snug text-[var(--app-text-muted)]",
              )}
            >
              {desc}
            </span>
          ) : null}
        </div>
        <span
          className={cn(
            "inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--app-border-solid)_40%,transparent)] text-[var(--app-text-tertiary)]",
          )}
          aria-hidden={true}
        >
          <ArrowRight className="size-4" strokeWidth={2} />
        </span>
      </Button>
      <DocumentViewer document={document} open={open} setOpen={setOpen} />
    </>
  );
};
