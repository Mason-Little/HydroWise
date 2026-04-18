import {
  type CreateQuizScope,
  type CreateQuizSelection,
  useCreateQuizContext,
} from "@/features/quiz/modules/create/context/create-quiz-context";
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

// Builds the initial selection for a given quiz scope.
const createSelectionForScope = (
  scope: CreateQuizScope,
): CreateQuizSelection => {
  switch (scope) {
    case "course":
      return { scope: "course" };
    case "chapter":
      return { scope: "chapter", chapterIds: [] };
    case "topic":
      return { scope: "topic", topicIds: [] };
    case "document":
      return { scope: "document", documentIds: [] };
  }
};

export const CreateQuizScopeSelector = () => {
  const { selection, setSelection } = useCreateQuizContext();

  return (
    <div className="-mt-0.5">
      <div className="grid gap-1.5 md:grid-cols-2 xl:grid-cols-4">
        {scopes.map((scope) => (
          <ScopeCard
            key={scope.name}
            scope={scope}
            selected={scope.name === selection.scope}
            onSelect={() => setSelection(createSelectionForScope(scope.name))}
          />
        ))}
      </div>
    </div>
  );
};
