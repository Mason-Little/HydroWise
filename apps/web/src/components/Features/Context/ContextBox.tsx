import { useState } from "react";
import { CourseCard } from "@/components/Features/Context/ui/CourseCard";
import { CreateCourseDialog } from "@/components/Features/Context/ui/CreateCourseDialog";
import { DocumentCard } from "@/components/Features/Context/ui/DocumentCard";
import { UploadFile } from "@/components/Features/Upload/UploadFile";
import { Button } from "@/components/ui/button";
import { useCourses } from "@/hooks/query/course.queries";
import { useDocument } from "@/hooks/query/document.queries";

export const ContextBox = () => {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [courseOpen, setCourseOpen] = useState(false);
  const { documents, deleteDocument } = useDocument();
  const { courses } = useCourses();
  const hasDocuments = (documents?.length ?? 0) > 0;
  const hasCourses = (courses?.length ?? 0) > 0;

  return (
    <div className="flex h-full flex-1">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Documents</h1>
            <p className="text-muted-foreground text-sm">
              Manage documents in your knowledge base.
            </p>
          </div>
          <Button onClick={() => setUploadOpen(true)}>Upload Document</Button>
          <Button onClick={() => setCourseOpen(true)}>Create Course</Button>
        </div>

        {hasCourses && (
          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {courses?.map((course) => (
              <CourseCard key={course.id} />
            ))}
          </div>
        )}

        {hasDocuments ? (
          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {documents?.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onDelete={(id) => deleteDocument(id)}
                onView={() => {}}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-52 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/50 px-6 text-center">
            <p className="text-sm font-medium">No Documents yet</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Upload your first document to get started.
            </p>
            <Button className="mt-4" onClick={() => setUploadOpen(true)}>
              Upload Document
            </Button>
          </div>
        )}
      </div>
      <UploadFile open={uploadOpen} onOpenChange={setUploadOpen} />
      <CreateCourseDialog open={courseOpen} onOpenChange={setCourseOpen} />
    </div>
  );
};
