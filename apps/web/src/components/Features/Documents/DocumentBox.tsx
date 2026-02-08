import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadFile } from "@/components/ui/upload-file";
import { useDocument } from "@/hooks/query/document.queries";
import { DocumentCard } from "./ui/document-card";

export const DocumentBox = () => {
  const [uploadOpen, setUploadOpen] = useState(false);
  const { documents, deleteDocument } = useDocument();
  const hasDocuments = (documents?.length ?? 0) > 0;

  return (
    <div className="flex h-full flex-1">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Documents</h1>
            <p className="text-muted-foreground text-sm">
              Manage files in your knowledge base.
            </p>
          </div>
          <Button onClick={() => setUploadOpen(true)}>Upload Document</Button>
        </div>

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
            <p className="text-sm font-medium">No documents yet</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Upload your first file to get started.
            </p>
            <Button className="mt-4" onClick={() => setUploadOpen(true)}>
              Upload Document
            </Button>
          </div>
        )}
      </div>
      <UploadFile open={uploadOpen} onOpenChange={setUploadOpen} />
    </div>
  );
};
