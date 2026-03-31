import { FileIcon, SendIcon, UploadIcon, XIcon } from "lucide-react";
import { useRef } from "react";
import { useUpload } from "@/features/ingest/upload/hooks/useUpload";

export const Upload = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { file, handleChange, handleSubmit, clearFile } = useUpload();

  return (
    <div className="flex items-center gap-1.5">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
      />
      {file ? (
        <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-md border px-3 py-2 text-sm">
          <FileIcon className="size-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-foreground">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <button
            type="button"
            onClick={clearFile}
            className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <XIcon className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <SendIcon className="size-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex flex-1 cursor-pointer items-center gap-2.5 rounded-md border border-dashed bg-muted/30 px-3 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted/50"
        >
          <UploadIcon className="size-4 shrink-0" />
          <span>Drop a syllabus or document to add to a course</span>
        </button>
      )}
    </div>
  );
};
