import { FileIcon, SendIcon, UploadIcon, XIcon } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { CommandGroup, CommandItem } from "@/components/ui/command";
import { useUpload } from "@/features/ingest/upload/hooks/useUpload";
import { ToolbarCommandSectionHeader } from "./ToolbarCommandSectionHeader";

const uploadRowIconButtonClass =
  "shrink-0 rounded-[8px] text-[var(--app-text-tertiary)] hover:bg-[color-mix(in_srgb,var(--app-workspace-bg)_55%,var(--app-surface-primary))]";

export function SyllabusDocumentUploadSection() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { file, handleChange, handleSubmit, clearFile } = useUpload();

  return (
    <div>
      <ToolbarCommandSectionHeader
        id="toolbar-command-section-upload"
        className="pt-3"
      >
        Upload
      </ToolbarCommandSectionHeader>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
      />
      <CommandGroup
        aria-labelledby="toolbar-command-section-upload"
        className="p-0 [&_[cmdk-group-heading]]:hidden"
      >
        {file ? (
          <div className="flex min-w-0 items-center gap-2.5 px-[14px] py-2">
            <FileIcon className="size-[14px] shrink-0 text-[var(--app-text-tertiary)]" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-medium text-[var(--app-text-primary)]">
                {file.name}
              </p>
              <p className="text-[11px] text-[var(--app-text-muted)]">
                {(file.size / 1024).toFixed(1)} KB · ready to ingest
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={clearFile}
              className={uploadRowIconButtonClass}
              aria-label="Remove selected file"
            >
              <XIcon className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => void handleSubmit()}
              className={uploadRowIconButtonClass}
              aria-label="Start ingest for selected file"
            >
              <SendIcon className="size-3.5" />
            </Button>
          </div>
        ) : (
          <CommandItem
            value="ingest-upload-syllabus-or-document"
            onSelect={() => fileInputRef.current?.click()}
            className="rounded-none px-[14px] py-2 text-[12px] font-normal text-[var(--app-text-primary)] data-[selected]:bg-[color-mix(in_srgb,var(--app-workspace-bg)_55%,var(--app-surface-primary))]"
          >
            <UploadIcon
              className="size-[14px] shrink-0 text-[var(--app-text-tertiary)]"
              aria-hidden
            />
            <span>Upload syllabus or document…</span>
          </CommandItem>
        )}
      </CommandGroup>
    </div>
  );
}
