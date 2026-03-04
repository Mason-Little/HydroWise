import { UploadIcon } from "lucide-react";

interface CompactBarProps {
  onBrowse: () => void;
}

export const CompactBar = ({ onBrowse }: CompactBarProps) => (
  <div className="flex w-full items-center justify-between gap-3">
    <div className="flex min-w-0 items-center gap-2.5">
      <UploadIcon
        className="size-4 shrink-0"
        style={{ color: "var(--hw-muted)" }}
      />
      <span className="truncate text-sm" style={{ color: "var(--hw-muted)" }}>
        Drop a syllabus or document to add to a course
      </span>
    </div>

    <button
      type="button"
      className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        onBrowse();
      }}
      style={{
        backgroundColor: "var(--hw-surface)",
        border: "1px solid var(--hw-border)",
        color: "var(--hw-text)",
      }}
    >
      Browse
    </button>
  </div>
);
