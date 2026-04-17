import { MessageSquare, XIcon } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { useChatThreads } from "@/domains/chat/hooks/useChatThreads";
import { useCourses } from "@/domains/courses/hooks/useCourses";
import { cn } from "@/lib/utils";
import { useFeatureStore } from "@/store/featureStore";
import { useThreadStore } from "@/store/threadStore";
import { ToolbarCommandSectionHeader } from "./ToolbarCommandSectionHeader";

type ThreadCommandSectionProps = {
  searchQuery: string;
  onDismiss: () => void;
};

type ThreadListRow = {
  id: string;
  title: string | null;
};

const threadMatchesQuery = (thread: ThreadListRow, needle: string): boolean => {
  if (needle === "") return true;
  const titleLower = thread.title?.trim().toLowerCase() ?? "";
  return (
    titleLower.includes(needle) || thread.id.toLowerCase().includes(needle)
  );
};

export function ThreadCommandSection({
  searchQuery,
  onDismiss,
}: ThreadCommandSectionProps) {
  const { threads, deleteChatThread } = useChatThreads();
  // TODO: Resolve thread.courseId via getCourse (or a shared global course cache) instead of
  // re-joining listCourses here. Fine until course state lives in one place app-wide.
  const { courses } = useCourses();
  const courseById = useMemo(
    () => new Map(courses.map((c) => [c.id, c])),
    [courses],
  );
  const { setActiveFeature } = useFeatureStore();
  const activeThreadId = useThreadStore((s) => s.activeThreadId);
  const setActiveThread = useThreadStore((s) => s.setActiveThread);

  const needle = searchQuery.trim().toLowerCase();
  const matchingThreads = threads.filter((t) => threadMatchesQuery(t, needle));

  return (
    <>
      <ToolbarCommandSectionHeader
        id="toolbar-command-section-threads"
        className="pt-2"
      >
        Chats
      </ToolbarCommandSectionHeader>
      <CommandGroup
        aria-labelledby="toolbar-command-section-threads"
        className="p-0 [&_[cmdk-group-heading]]:hidden"
      >
        {matchingThreads.length === 0 ? (
          <CommandEmpty className="px-[14px] py-2 text-[12px] text-[var(--app-text-muted)]">
            No matching threads
          </CommandEmpty>
        ) : (
          matchingThreads.map((thread) => {
            const isActive = activeThreadId === thread.id;
            const course = thread.courseId
              ? courseById.get(thread.courseId)
              : undefined;
            return (
              <CommandItem
                key={thread.id}
                value={`${thread.id}-${thread.title ?? ""}-${course?.courseCode ?? ""}`}
                onSelect={() => {
                  setActiveFeature("chat");
                  setActiveThread(thread.id);
                  onDismiss();
                }}
                className={cn(
                  "rounded-none px-[14px] py-2 text-[12px] font-normal text-[var(--app-text-primary)] data-[selected]:bg-[color-mix(in_srgb,var(--app-workspace-bg)_55%,var(--app-surface-primary))]",
                  isActive &&
                    "bg-[color-mix(in_srgb,var(--app-accent-soft)_75%,var(--app-surface-primary))] font-medium data-[selected]:bg-[color-mix(in_srgb,var(--app-accent-soft)_75%,var(--app-surface-primary))]",
                )}
              >
                <MessageSquare
                  className="size-[14px] shrink-0 text-[var(--app-text-tertiary)]"
                  aria-hidden
                />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
                  {course ? (
                    <span className="truncate text-[11px] text-[var(--app-text-muted)]">
                      {course.courseCode}
                    </span>
                  ) : null}
                  <span className="truncate">{thread.title}</span>
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    deleteChatThread(thread.id);
                  }}
                >
                  <XIcon className="size-[14px] shrink-0 text-[var(--app-text-tertiary)]" />
                </Button>
              </CommandItem>
            );
          })
        )}
      </CommandGroup>
    </>
  );
}
