import { useQuizContext } from "@/features/quiz/context/quiz-context";
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

export const ScopeRail = () => {
  const { activeScope, setActiveScope } = useQuizContext();

  return (
    <div className="border-t border-[color-mix(in_srgb,var(--app-border-solid)_35%,transparent)] pt-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
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
