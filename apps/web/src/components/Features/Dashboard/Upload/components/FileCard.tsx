import { motion } from "framer-motion";
import { FileTextIcon, Trash2Icon } from "lucide-react";

interface FileCardProps {
  file: File;
  onRemove: () => void;
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const FileCard = ({ file, onRemove }: FileCardProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.15 }}
    className="relative flex min-h-36 w-48 flex-col justify-between rounded-xl border p-3"
    style={{
      borderColor: "var(--hw-border)",
      backgroundColor: "var(--hw-surface)",
    }}
  >
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onRemove();
      }}
      aria-label={`Remove ${file.name}`}
      className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-md transition-colors"
      style={{ color: "var(--hw-muted)" }}
    >
      <Trash2Icon className="size-3.5" />
    </button>

    <div
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border"
      style={{
        borderColor: "var(--hw-border)",
        backgroundColor: "var(--hw-bg)",
        color: "var(--hw-muted)",
      }}
    >
      <FileTextIcon className="size-5" />
    </div>

    <div className="min-w-0 space-y-1">
      <p
        className="truncate text-sm font-medium"
        style={{ color: "var(--hw-text)" }}
      >
        {file.name}
      </p>
      <p className="text-xs" style={{ color: "var(--hw-muted)" }}>
        {formatFileSize(file.size)}
      </p>
    </div>
  </motion.div>
);
