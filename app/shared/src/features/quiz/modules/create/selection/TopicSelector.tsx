import type { Dispatch, SetStateAction } from "react";
import { useTopicsByCourse } from "@/domains/material/hooks/useTopics";
import { useDashboardContext } from "@/features/dashboard/dashboard-context";
import type { CreateQuizSelection } from "@/features/quiz/modules/create/context/create-quiz-context";
import { SelectableTile } from "@/features/quiz/modules/create/selection/SelectableTile";

type TopicSelectorProps = {
  topicIds: string[];
  setSelection: Dispatch<SetStateAction<CreateQuizSelection>>;
};

export const TopicSelector = ({
  topicIds,
  setSelection,
}: TopicSelectorProps) => {
  const { activeCourse } = useDashboardContext();
  const { topics } = useTopicsByCourse(activeCourse.id);

  return (
    <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
      {topics.map((topic) => {
        const selected = topicIds.includes(topic.id);
        const onSelect = () => {
          setSelection({
            scope: "topic",
            topicIds: selected
              ? topicIds.filter((id) => id !== topic.id)
              : [...topicIds, topic.id],
          });
        };

        return (
          <SelectableTile
            key={topic.id}
            selected={selected}
            onSelect={onSelect}
            title={topic.name}
            description={topic.description}
          />
        );
      })}
    </div>
  );
};
