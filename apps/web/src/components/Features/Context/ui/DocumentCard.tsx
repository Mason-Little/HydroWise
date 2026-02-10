import type { CreatedDocument } from "@hydrowise/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDocument } from "@/hooks/query/document.queries";

interface DocumentCardProps {
  document: CreatedDocument;
}

export const DocumentCard = ({ document }: DocumentCardProps) => {
  const { deleteDocument } = useDocument();

  const handleDelete = () => {
    deleteDocument(document.id);
  };

  return (
    <Card className="aspect-square w-full max-w-36 gap-1.5 border-border/60 bg-card/80 py-2 shadow-none">
      <CardHeader className="px-2.5 pb-0.5 pt-1.5">
        <CardTitle className="line-clamp-2 text-xs font-medium leading-tight">
          {document.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-0.5 px-2.5 pb-0 text-[11px] text-muted-foreground">
        <p className="truncate">{document.mimeType}</p>
      </CardContent>
      <div className="mt-auto flex items-center justify-end px-2.5 pb-1">
        {/* TODO: Add a view modal */}
        <Button
          variant="destructive"
          size="sm"
          className="h-6 px-2 text-[11px]"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </div>
    </Card>
  );
};
