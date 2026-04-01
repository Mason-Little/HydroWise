import { useMaterialSelection } from "@/features/dashboard/Info/material/context/MaterialSelectionContext";
import { useChapterDocuments } from "@/features/dashboard/Info/material/hooks/useChapterDocuments";

export const MaterialContentPanel = () => {
  const { activeChapter } = useMaterialSelection();
  const chapterId = activeChapter?.id ?? "";
  const { documents, isPending } = useChapterDocuments(chapterId);

  if (!activeChapter) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center px-6 py-10">
        <p className="text-sm text-muted-foreground">No chapter selected</p>
      </div>
    );
  }

  const description = activeChapter.chapterDescription.trim();

  return (
    <article className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-6 py-6 sm:px-8">
      <header>
        <h2 className="font-display text-lg font-semibold text-foreground">
          {activeChapter.chapterName}
        </h2>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </header>

      {isPending ? (
        <p className="text-sm text-muted-foreground">Loading documents…</p>
      ) : !documents?.length ? (
        <p className="text-sm text-muted-foreground">
          No documents for this chapter yet.
        </p>
      ) : (
        <ul className="space-y-2 text-sm text-foreground">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="border-b border-border pb-2 last:border-0"
            >
              <span className="font-medium">{doc.name}</span>
              {doc.description ? (
                <p className="mt-0.5 text-muted-foreground">
                  {doc.description}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
};
