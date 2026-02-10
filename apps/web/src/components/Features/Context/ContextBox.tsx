import { useMemo, useState } from "react";
import { CourseCard } from "@/components/Features/Context/ui/CourseCard";
import { CreateCourseDialog } from "@/components/Features/Context/ui/CreateCourseDialog";
import { DocumentCard } from "@/components/Features/Context/ui/DocumentCard";
import { UploadFile } from "@/components/Features/Upload/UploadFile";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useCourses } from "@/hooks/query/course.queries";
import { useDocument } from "@/hooks/query/document.queries";

export const ContextBox = () => {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [courseOpen, setCourseOpen] = useState(false);
  const { documents } = useDocument();
  const { courses } = useCourses();

  const activeCourses = useMemo(
    () => courses?.filter((course) => course.status === "active"),
    [courses],
  );
  const inactiveCourses = useMemo(
    () => courses?.filter((course) => course.status === "inactive"),
    [courses],
  );
  const unsortedDocuments = useMemo(
    () => documents?.filter((document) => !document.courseId),
    [documents],
  );

  const getDocumentsByCourseId = (courseId: string) => {
    return documents?.filter((document) => document.courseId === courseId);
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            Workspace Context
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage HydroWise Workspace Context in your knowledge base.
          </p>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <Button
            className="flex-1 sm:flex-none"
            onClick={() => setUploadOpen(true)}
          >
            Upload Document
          </Button>
          <Button onClick={() => setCourseOpen(true)}>Create Course</Button>
        </div>
      </div>

      <Card className="space-y-3 border-border/70 bg-card/80 p-3 shadow-none">
        <Collapsible
          defaultOpen
          className="rounded-lg border border-border/60 bg-background/30"
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-accent/40">
            <span>Active Courses</span>
            <span className="text-muted-foreground text-xs">
              {activeCourses?.length ?? 0}
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 px-3 pb-3">
            {(activeCourses?.length ?? 0) > 0 ? (
              activeCourses?.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  documents={getDocumentsByCourseId(course.id)}
                />
              ))
            ) : (
              <p className="text-muted-foreground text-xs">
                No active courses.
              </p>
            )}
          </CollapsibleContent>
        </Collapsible>

        <Collapsible
          defaultOpen
          className="rounded-lg border border-border/60 bg-background/30"
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-accent/40">
            <span>Unsorted Documents</span>
            <span className="text-muted-foreground text-xs">
              {unsortedDocuments?.length ?? 0}
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-3 pb-3 pt-0">
            {(unsortedDocuments?.length ?? 0) > 0 ? (
              <div className="flex flex-wrap gap-2">
                {unsortedDocuments?.map((document) => (
                  <DocumentCard key={document.id} document={document} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-xs">
                No unsorted documents.
              </p>
            )}
          </CollapsibleContent>
        </Collapsible>

        <Collapsible className="rounded-lg border border-border/60 bg-background/30">
          <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-accent/40">
            <span>Archived Courses</span>
            <span className="text-muted-foreground text-xs">
              {inactiveCourses?.length ?? 0}
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 px-3 pb-3">
            {(inactiveCourses?.length ?? 0) > 0 ? (
              inactiveCourses?.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  documents={getDocumentsByCourseId(course.id)}
                />
              ))
            ) : (
              <p className="text-muted-foreground text-xs">
                No archived courses.
              </p>
            )}
          </CollapsibleContent>
        </Collapsible>
      </Card>
      <UploadFile open={uploadOpen} onOpenChange={setUploadOpen} />
      <CreateCourseDialog open={courseOpen} onOpenChange={setCourseOpen} />
    </div>
  );
};
