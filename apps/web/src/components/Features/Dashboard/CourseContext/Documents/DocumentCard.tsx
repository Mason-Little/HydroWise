import type { Document } from "@hydrowise/entities";
import { FileTextIcon } from "lucide-react";

import { titleToColour } from "@/lib/colour/title-to-colour";

interface DocumentCardProps {
  document: Document;
}

export const DocumentCard = ({ document }: DocumentCardProps) => {
  const documentBadgeColours = titleToColour(
    document.mimeType || document.name,
  );

  return (
    <div
      className="flex w-full flex-col gap-2 rounded-xl border p-3"
      style={{
        backgroundColor: "var(--hw-surface)",
        borderColor: "var(--hw-border)",
      }}
    >
      <FileTextIcon
        className="size-4"
        style={{ color: "var(--hw-muted)" }}
        aria-hidden="true"
      />

      <h1
        className="truncate text-sm font-semibold"
        style={{ color: "var(--hw-card-title)" }}
        title={document.name}
      >
        {document.name}
      </h1>

      <div className="mt-0.5 flex items-center gap-1.5">
        <span
          className="inline-flex h-5 items-center rounded-md border px-2 text-[10px] font-semibold tracking-wide"
          style={{
            backgroundColor: documentBadgeColours.notSelected,
            color: "var(--hw-card-title)",
            borderColor: documentBadgeColours.selected,
          }}
        >
          {/* TODO: change DB schema to use document type instead of mime type */}
          {document.mimeType}
        </span>

        {/* TODO: add Topic Badge */}

        <span
          className="inline-flex h-5 min-w-8 items-center justify-center rounded-full border border-dashed px-2 text-[10px]"
          style={{
            color: "var(--hw-muted-2)",
            borderColor: "var(--hw-border)",
            backgroundColor: "var(--hw-surface-2)",
          }}
        >
          -
        </span>
      </div>
    </div>
  );
};
