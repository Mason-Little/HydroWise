import type { CreatedDocument } from "@hydrowise/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`;
  }

  return `${(kb / 1024).toFixed(1)} MB`;
};

interface DocumentCardProps {
  document: CreatedDocument;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export const DocumentCard = ({
  document,
  onDelete,
  onView,
}: DocumentCardProps) => {
  return (
    <Card className="border-border/70 bg-card/90">
      <CardHeader className="pb-3">
        <CardTitle className="line-clamp-1 text-sm font-semibold">
          {document.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 pb-0 text-xs text-muted-foreground">
        <p className="truncate">{document.mimeType}</p>
        <p>{formatFileSize(document.fileSize)}</p>
      </CardContent>
      <div className="mt-auto flex items-center justify-end gap-2 px-6 pb-6">
        {/* TODO: Add a view modal */}
        <Button variant="outline" size="sm" onClick={() => onView(document.id)}>
          View
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(document.id)}
        >
          Delete
        </Button>
      </div>
    </Card>
  );
};
