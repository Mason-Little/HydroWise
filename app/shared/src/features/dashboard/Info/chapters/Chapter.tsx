import { useDashboardContext } from "@/features/dashboard/Dashboard";
import { useChapters } from "@/features/dashboard/Info/chapters/hooks/useChapters";

export const Chapter = () => {
  const { activeCourse } = useDashboardContext();
  const { chapters, isLoading } = useChapters(activeCourse?.id ?? "");

  if (!activeCourse) return null;
  if (isLoading)
    return <div className="text-muted-foreground">Loading chapters…</div>;
  if (chapters.length === 0)
    return <div className="text-muted-foreground">No chapters yet.</div>;

  return (
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
  );
};
