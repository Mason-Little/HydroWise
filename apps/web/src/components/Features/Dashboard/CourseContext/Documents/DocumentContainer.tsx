import { DocumentCard } from "@/components/Features/Dashboard/CourseContext/Documents/DocumentCard";
import { useDocument } from "@/hooks/query/document.queries";

interface DocumentContainerProps {
  chapterId: string;
}

export const DocumentContainer = ({ chapterId }: DocumentContainerProps) => {
  const { documents } = useDocument();
  const documentsInChapter = documents?.filter(
    (d) => d.chapterId === chapterId,
  );
  return (
    <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
      {documentsInChapter?.map((document) => (
        <DocumentCard key={document.id} document={document} />
      ))}
    </div>
  );
};
