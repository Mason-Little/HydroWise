import { FileText } from "lucide-react";
import { useTopicsByCourse } from "@/domains/material/hooks/useTopics";
import { useDashboardContext } from "@/features/dashboard/dashboard-context";
import { SelectableTile } from "@/features/quiz/modules/create/selection/SelectableTile";

type TopicSelectorProps = {
  topicIds: string[];
  toggleTopic: (topicId: string) => void;
};

export const TopicSelector = ({
  topicIds,
  toggleTopic,
}: TopicSelectorProps) => {
  const { activeCourse } = useDashboardContext();
  const { topics } = useTopicsByCourse(activeCourse.id);

  if (topics.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center py-8">
        <div className="mx-auto flex max-w-sm flex-col items-center text-center">
          <div className="mb-3 flex size-10 items-center justify-center rounded-xl border border-border/60 bg-[var(--app-surface-secondary)] text-[var(--app-text-tertiary)]">
            <FileText className="size-4" aria-hidden />
          </div>
          <p className="text-[0.92rem] font-semibold text-[var(--app-text-primary)]">
            No topics yet
          </p>
          <p className="mt-1 text-[0.8rem] leading-5 text-[var(--app-text-muted)]">
            Add course topics to build quizzes from individual topics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-2.5 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
      {topics.map((topic) => {
        const selected = topicIds.includes(topic.id);

        return (
          <SelectableTile
            key={topic.id}
            selected={selected}
            onSelect={() => toggleTopic(topic.id)}
            title={topic.name}
            description={topic.description}
          />
        );
      })}
    </div>
  );
};
