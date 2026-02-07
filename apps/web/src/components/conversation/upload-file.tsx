import { FileUpIcon } from "lucide-react";
import { useCallback, useId, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type UploadFileProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UploadFile({ open, onOpenChange }: UploadFileProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputId = useId();

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    if (!acceptedFiles.length) {
      return;
    }

    setSelectedFile(acceptedFiles[0] ?? null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    multiple: false,
  });

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSelectedFile(null);
    }

    onOpenChange(nextOpen);
  };

  const handleUpload = () => {
    console.log("Uploading file...", selectedFile);

    handleDialogOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Upload a file to the conversation.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div
            {...getRootProps({
              className: cn(
                "group flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-5 py-6 text-center transition-colors",
                "bg-muted/30",
                isDragActive
                  ? "border-primary bg-primary/10"
                  : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/60",
              ),
            })}
          >
            <input {...getInputProps({ id: inputId })} />
            <span className="mb-3 rounded-full border border-border bg-background p-2 text-muted-foreground transition-colors group-hover:text-foreground">
              <FileUpIcon className="size-4" />
            </span>
            <p className="text-sm font-medium">
              {isDragActive
                ? "Drop your file here"
                : "Drag and drop a file here"}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              or click to browse
            </p>
            {selectedFile ? (
              <p className="bg-background text-foreground mt-3 max-w-full rounded-full border px-3 py-1 text-xs">
                {selectedFile.name}
              </p>
            ) : null}
          </div>
          <Button disabled={!selectedFile} onClick={handleUpload}>
            Upload
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
