import { useCreateQuizContext } from "@/features/quiz/modules/create/context/create-quiz-context";
import { ScopeCard } from "@/features/quiz/modules/create/ScopeCard";

const scopes = [
  {
    name: "course",
    description: "Use the whole course or let HydroWise balance it.",
  },
  {
    name: "chapter",
    description: "Select one or more chapters.",
  },
  {
    name: "topic",
    description: "Select one or more topics.",
  },
  {
    name: "document",
    description: "Select one or more documents.",
  },
] as const;

export const CreateQuizScopeSelector = () => {
  const { activeScope, setActiveScope } = useCreateQuizContext();

  return (
    <div className="-mt-0.5">
      <div className="grid gap-1.5 md:grid-cols-2 xl:grid-cols-4">
        {scopes.map((scope) => (
          <ScopeCard
            key={scope.name}
            scope={scope}
            selected={scope.name === activeScope}
            onSelect={() => setActiveScope(scope.name)}
          />
        ))}
      </div>
    </div>
  );
};
