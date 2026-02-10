import { FileUpIcon } from "lucide-react";
import { useCallback, useId } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

type FileUploadDraggerProps = {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
  className?: string;
};

export function FileUploadDragger({
  selectedFile,
  onFileSelect,
  disabled = false,
  className,
}: FileUploadDraggerProps) {
  const inputId = useId();

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFileSelect(acceptedFiles[0] ?? null);
    },
    [onFileSelect],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    multiple: false,
    disabled,
  });

  return (
    <div
      {...getRootProps({
        className: cn(
          "group flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-5 py-6 text-center transition-colors",
          "bg-muted/30",
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/60",
          disabled &&
            "pointer-events-none cursor-not-allowed border-muted/60 opacity-60",
          className,
        ),
      })}
    >
      <input {...getInputProps({ id: inputId })} />
      <span className="mb-3 rounded-full border border-border bg-background p-2 text-muted-foreground transition-colors group-hover:text-foreground">
        <FileUpIcon className="size-4" />
      </span>
      <p className="text-sm font-medium">
        {isDragActive ? "Drop your file here" : "Drag and drop a file here"}
      </p>
      <p className="text-muted-foreground mt-1 text-xs">or click to browse</p>
      {selectedFile ? (
        <p className="bg-background text-foreground mt-3 max-w-full rounded-full border px-3 py-1 text-xs">
          {selectedFile.name}
        </p>
      ) : null}
    </div>
  );
}
