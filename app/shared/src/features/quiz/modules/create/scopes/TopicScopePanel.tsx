import { SelectionPanel } from "@/features/quiz/modules/create/scopes/SelectionPanel";
import { TopicSelector } from "@/features/quiz/modules/create/selection/TopicSelector";

type TopicScopePanelProps = {
  topicIds: string[];
  toggleTopic: (topicId: string) => void;
};

export const TopicScopePanel = ({
  topicIds,
  toggleTopic,
}: TopicScopePanelProps) => {
  return (
    <SelectionPanel
      title="Choose topics"
      description="Pick the topics you want included in this quiz set."
    >
      <TopicSelector topicIds={topicIds} toggleTopic={toggleTopic} />
    </SelectionPanel>
  );
};
