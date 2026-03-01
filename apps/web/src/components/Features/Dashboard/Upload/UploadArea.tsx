import { UploadIcon } from "lucide-react";

export const UploadArea = () => {
  return (
    <div
      className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2"
      style={{
        backgroundColor: "var(--hw-bg)",
        border: "1px solid var(--hw-border)",
      }}
    >
      <div className="flex items-center gap-2.5">
        <UploadIcon
          className="size-4 shrink-0"
          style={{ color: "var(--hw-muted)" }}
        />
        <span className="text-sm" style={{ color: "var(--hw-muted)" }}>
          Drop a syllabus or document to add to a course
        </span>
      </div>
      <button
        type="button"
        className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
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
};
