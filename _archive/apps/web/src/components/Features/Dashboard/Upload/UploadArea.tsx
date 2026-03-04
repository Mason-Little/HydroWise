import { AnimatePresence, motion } from "framer-motion";
import { useId, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useCourses } from "@/hooks/query/course.queries";
import { uploadDocuments } from "@/hooks/upload/upload-document";
import { CompactBar } from "./ui/CompactBar";
import { ExpandedView } from "./ui/ExpandedView";

export function UploadArea() {
  const inputId = useId();
  const [files, setFiles] = useState<File[]>([]);
  const { courses } = useCourses();

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setFiles((prev) => {
      const existingNames = new Set(prev.map((f) => f.name));
      const unique = acceptedFiles.filter((f) => !existingNames.has(f.name));
      return [...prev, ...unique];
    });
  };

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const handleUpload = async () => {
    uploadDocuments(files, courses);
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: handleDrop,
    multiple: true,
    noClick: true,
  });

  const isExpanded = isDragActive || files.length > 0;

  return (
    <div
      {...getRootProps()}
      className="w-full rounded-lg px-3 py-2 transition-colors"
      style={{
        backgroundColor: isDragActive ? "var(--hw-surface)" : "var(--hw-bg)",
        border: `1px solid ${isDragActive ? "var(--hw-muted)" : "var(--hw-border)"}`,
      }}
    >
      <input {...getInputProps({ id: inputId })} />

      <AnimatePresence mode="wait" initial={false}>
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, height: 44 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 44 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <ExpandedView
              files={files}
              onRemoveFile={removeFile}
              onAddMore={open}
              onUpload={handleUpload}
            />
          </motion.div>
        ) : (
          <motion.div
            key="compact"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <CompactBar onBrowse={open} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
