import { useState } from "react";
import { CreateCourseDialog } from "@/components/Features/Context/ui/create-course-dialog";
import { Button } from "@/components/ui/button";
import { UploadFile } from "@/components/ui/upload-file";
import { useDocument } from "@/hooks/query/document.queries";
import { ContextCard } from "./ui/document-card";

export const ContextBox = () => {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [courseOpen, setCourseOpen] = useState(false);
  const { documents: contextItems, deleteDocument } = useDocument();
  const hasContextItems = (contextItems?.length ?? 0) > 0;

  return (
    <div className="flex h-full flex-1">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Context</h1>
            <p className="text-muted-foreground text-sm">
              Manage context files in your knowledge base.
            </p>
          </div>
          <Button onClick={() => setUploadOpen(true)}>Upload Context</Button>
          <Button onClick={() => setCourseOpen(true)}>Create Course</Button>
        </div>

        {hasContextItems ? (
          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {contextItems?.map((contextItem) => (
              <ContextCard
                key={contextItem.id}
                document={contextItem}
                onDelete={(id) => deleteDocument(id)}
                onView={() => {}}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-52 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/50 px-6 text-center">
            <p className="text-sm font-medium">No context files yet</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Upload your first context file to get started.
            </p>
            <Button className="mt-4" onClick={() => setUploadOpen(true)}>
              Upload Context
            </Button>
          </div>
        )}
      </div>
      <UploadFile open={uploadOpen} onOpenChange={setUploadOpen} />
      <CreateCourseDialog open={courseOpen} onOpenChange={setCourseOpen} />
    </div>
  );
};
