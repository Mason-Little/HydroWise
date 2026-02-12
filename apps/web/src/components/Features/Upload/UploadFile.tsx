import type { Chapter, Course } from "@hydrowise/entities";
import { CircleQuestionMarkIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCourses } from "@/hooks/query/course.queries";
import { useDocumentUpload } from "@/hooks/upload/useDocumentUpload";
import { CourseChapterCombobox } from "./ui/CourseChapterCombobox";
import { FileUploadDragger } from "./ui/FileUploadDragger";

type UploadFileProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UploadFile({ open, onOpenChange }: UploadFileProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  const { courses } = useCourses();
  const { uploadFileWithEmbeddings, isUploading } = useDocumentUpload();

  const resetForm = () => {
    setSelectedFile(null);
    setFileName("");
    setSelectedCourse(null);
    setSelectedChapter(null);
  };

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetForm();
    }

    onOpenChange(nextOpen);
  };

  const handleUpload = async () => {
    if (!selectedFile || isUploading) {
      return;
    }

    await uploadFileWithEmbeddings({
      file: selectedFile,
      fileName,
      course: selectedCourse,
      chapter: selectedChapter,
      onDocumentPersisted: () => handleDialogOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <span>Upload a file to your knowledge base.</span>
            <Tooltip>
              <TooltipTrigger
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex size-5 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none"
                aria-label="What is the knowledge base?"
              >
                <CircleQuestionMarkIcon className="size-4" />
              </TooltipTrigger>
              <TooltipContent className="max-w-72 text-sm">
                <p>
                  Files added here are reusable across chats, so you only need
                  to upload them once.
                </p>
              </TooltipContent>
            </Tooltip>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Field>
            <FieldLabel>Document Name</FieldLabel>
            <FieldContent>
              <Input
                placeholder="Custom file name (optional)"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                disabled={isUploading}
              />
            </FieldContent>
          </Field>

          <CourseChapterCombobox
            courses={courses}
            selectedCourse={selectedCourse}
            selectedChapter={selectedChapter}
            onCourseChange={setSelectedCourse}
            onChapterChange={setSelectedChapter}
            disabled={isUploading}
          />

          <div className="space-y-3">
            <FileUploadDragger
              selectedFile={selectedFile}
              onFileSelect={setSelectedFile}
              disabled={isUploading}
            />
            <Button
              className="w-full"
              disabled={!selectedFile || isUploading}
              onClick={handleUpload}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
