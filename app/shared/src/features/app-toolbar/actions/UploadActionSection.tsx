import { FileIcon, SendIcon, UploadIcon, XIcon } from "lucide-react";
import { useRef } from "react";
import { useUpload } from "@/features/dashboard/selection/upload/hooks/useUpload";

type UploadActionSectionProps = {
  query: string;
};

export function UploadActionSection(_props: UploadActionSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { file, handleChange, handleSubmit, clearFile } = useUpload();

  return (
    <div className="flex flex-col gap-0.5">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
      />
      {file ? (
        <div className="flex min-w-0 items-center gap-2 rounded-sm border border-border px-2 py-1.5">
          <FileIcon className="size-3.5 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-foreground">
              {file.name}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <button
            type="button"
            onClick={clearFile}
            className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Clear file"
          >
            <XIcon className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => void handleSubmit()}
            className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Upload file"
          >
            <SendIcon className="size-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full items-center gap-2 rounded-sm border border-dashed border-border/80 bg-muted/20 px-2 py-2 text-left text-xs text-muted-foreground transition-colors hover:bg-accent/40"
        >
          <UploadIcon className="size-3.5 shrink-0 opacity-70" aria-hidden />
          <span>Upload syllabus or document…</span>
        </button>
      )}
    </div>
  );
}
