import {
  useCreateQuizContext,
} from "@/features/quiz/modules/create/context/create-quiz-context";
import { ScopeCard } from "@/features/quiz/modules/create/ScopeCard";

const scopes = [
  {
    name: "course",
    description: "Full course quiz.",
  },
  {
    name: "chapter",
    description: "Chapter quiz.",
  },
  {
    name: "topic",
    description: "Topic quiz.",
  },
  {
    name: "document",
    description: "Document quiz.",
  },
] as const;

export const CreateQuizScopeSelector = () => {
  const { selection, setScope } = useCreateQuizContext();

  return (
    <div className="mx-1 mt-1 mb-0.5">
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        {scopes.map((scope) => (
          <ScopeCard
            key={scope.name}
            scope={scope}
            selected={scope.name === selection.scope}
            onSelect={() => setScope(scope.name)}
          />
        ))}
      </div>
    </div>
  );
};
