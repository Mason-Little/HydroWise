import { ingestFile } from "@hydrowise/file-ingest";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Upload = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    await ingestFile(selected);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
      />
      <Button
        variant="outline"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "h-auto w-full flex-col gap-1 border-dashed py-6",
          file && "border-solid bg-muted/30",
        )}
      >
        {file ? (
          <>
            <span className="font-medium">{file.name}</span>
            <span className="text-[0.625rem] text-muted-foreground">
              {(file.size / 1024).toFixed(1)} KB · click to change
            </span>
          </>
        ) : (
          <>
            <span>Upload a file</span>
            <span className="text-[0.625rem] text-muted-foreground">
              Click to browse
            </span>
          </>
        )}
      </Button>
    </>
  );
};
