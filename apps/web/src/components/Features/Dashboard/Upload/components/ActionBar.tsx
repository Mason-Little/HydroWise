interface ActionBarProps {
  fileCount: number;
  onUpload: () => void;
}

export const ActionBar = ({ fileCount, onUpload }: ActionBarProps) => (
  <div className="flex w-full items-center justify-between pt-2">
    <span className="text-xs" style={{ color: "var(--hw-muted)" }}>
      {fileCount} {fileCount === 1 ? "file" : "files"} selected
    </span>
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onUpload();
      }}
      className="rounded-lg px-4 py-1.5 text-xs font-medium transition-colors"
      style={{
        backgroundColor: "var(--hw-text)",
        color: "var(--hw-bg)",
      }}
    >
      Upload
    </button>
  </div>
);
