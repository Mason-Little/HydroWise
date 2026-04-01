import { useDashboardContext } from "@/features/dashboard/dashboard-context";
import { useChapters } from "@/features/dashboard/Info/material/hooks/useChapters";

export const Material = () => {
  const { activeCourse } = useDashboardContext();
  const { chapters, isLoading } = useChapters(activeCourse?.id ?? "");

  if (!activeCourse) return null;
  if (isLoading)
    return <div className="text-muted-foreground">Loading chapters…</div>;
  if (chapters.length === 0)
    return <div className="text-muted-foreground">No chapters yet.</div>;

  return (
    <div className="app-workspace-panel-scroll flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">
      <ul className="space-y-1">
        {chapters.map((chapter) => (
          <li key={chapter.id}>
            <p className="text-sm font-medium">{chapter.chapterName}</p>
            <p className="text-xs text-muted-foreground">
              {chapter.chapterDescription}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};
