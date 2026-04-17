import { useTopicsByCourse } from "@/domains/material/hooks/useTopics";
import { useDashboardContext } from "@/features/dashboard/dashboard-context";
import { useCreateQuizContext } from "@/features/quiz/modules/create/context/create-quiz-context";
import { SelectableTile } from "@/features/quiz/modules/create/selection/SelectableTile";

export const TopicSelector = () => {
  const { activeCourse } = useDashboardContext();

  if (!activeCourse) {
    return null;
  }

  return <TopicSelectorContent courseId={activeCourse.id} />;
};

const TopicSelectorContent = ({ courseId }: { courseId: string }) => {
  const { topics } = useTopicsByCourse(courseId);
  const { selectedTopicIds, setSelectedTopicIds } = useCreateQuizContext();

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {topics.map((topic) => {
        const selected = selectedTopicIds.includes(topic.id);
        const onSelect = () => {
          setSelectedTopicIds(
            selected
              ? selectedTopicIds.filter((id) => id !== topic.id)
              : [...selectedTopicIds, topic.id],
          );
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
