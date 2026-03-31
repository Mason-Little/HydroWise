import { Separator } from "@/components/ui/separator";
import { CourseActionResults } from "./CourseActionResults";
import { FeatureActionResults } from "./FeatureActionResults";
import { UploadActionSection } from "./UploadActionSection";

/** When true, renders course rows below a divider after features. */
const SHOW_COURSE_ACTION_SECTION = false;

type ActionResultsPanelProps = {
  query: string;
  onClosePanel: () => void;
};

export function ActionResultsPanel({
  query,
  onClosePanel,
}: ActionResultsPanelProps) {
  return (
    <div className="flex flex-col gap-2">
      <FeatureActionResults query={query} onClosePanel={onClosePanel} />
      {SHOW_COURSE_ACTION_SECTION ? (
        <>
          <Separator className="bg-border/80" />
          <CourseActionResults query={query} />
        </>
      ) : null}
      <Separator className="bg-border/80" />
      <UploadActionSection query={query} />
    </div>
  );
}
