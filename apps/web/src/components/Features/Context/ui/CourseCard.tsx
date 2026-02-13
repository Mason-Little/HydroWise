import type { Course, CreatedDocument } from "@hydrowise/entities";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useChapters } from "@/hooks/query/chapter.queries";
import { useCourses } from "@/hooks/query/course.queries";
import { DocumentCard } from "./DocumentCard";

interface CourseCardProps {
  course: Course;
  documents?: CreatedDocument[];
}

export const CourseCard = ({ course, documents }: CourseCardProps) => {
  const { deleteCourse } = useCourses();
  const { chapters } = useChapters(course.id);

  const getDocsForChapter = (chapterId: string) => {
    return documents?.filter((document) => document.chapterId === chapterId);
  };

  const unsortedDocs = useMemo(() => {
    return documents?.filter((document) => !document.chapterId);
  }, [documents]);

  return (
    <Card className="border-border/60 bg-card/75 shadow-none">
      <Collapsible defaultOpen className="space-y-2 p-2">
        <div className="flex items-center gap-2">
          <CollapsibleTrigger className="flex flex-1 items-center justify-between rounded-md px-2.5 py-2 text-left transition-colors hover:bg-accent/40">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold leading-tight">
                {course.name}
              </p>
              <p className="text-muted-foreground text-xs">
                {chapters.length} chapters
              </p>
            </div>
            <span className="text-muted-foreground text-xs capitalize">
              {course.status}
            </span>
          </CollapsibleTrigger>
          <Button
            variant="destructive"
            size="sm"
            className="h-7 px-2.5 text-xs"
            onClick={() => deleteCourse(course.id)}
          >
            Delete
          </Button>
        </div>

        <CollapsibleContent className="space-y-2 px-1 pb-1">
          <div className="space-y-2">
            {chapters.length > 0 ? (
              chapters.map((chapter) => {
                const chapterDocs = getDocsForChapter(chapter.id);
                return (
                  <Collapsible
                    key={chapter.id}
                    defaultOpen
                    className="rounded-md border border-border/50 bg-background/30"
                  >
                    <div className="flex items-center gap-2">
                      <CollapsibleTrigger className="flex w-full items-center justify-between px-2.5 py-2 text-left text-sm font-medium transition-colors hover:bg-accent/30">
                        <span className="line-clamp-1">{chapter.name}</span>
                        <span className="text-muted-foreground text-xs"></span>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="px-2 pb-2">
                      {(chapterDocs?.length ?? 0) > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {chapterDocs?.map((document) => (
                            <DocumentCard
                              key={document.id}
                              document={document}
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground px-1 text-xs">
                          No documents in this chapter.
                        </p>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                );
              })
            ) : (
              <p className="text-muted-foreground px-2 text-xs">
                No chapters yet.
              </p>
            )}

            <Collapsible className="rounded-md border border-border/50 bg-background/30">
              <CollapsibleTrigger className="flex w-full items-center justify-between px-2.5 py-2 text-left text-sm font-medium transition-colors hover:bg-accent/30">
                <span>Unsorted {course.name} documents</span>
                <span className="text-muted-foreground text-xs">
                  {unsortedDocs?.length ?? 0}
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-2 pb-2">
                {(unsortedDocs?.length ?? 0) > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {unsortedDocs?.map((document) => (
                      <DocumentCard key={document.id} document={document} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground px-1 text-xs">
                    No unsorted documents.
                  </p>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
