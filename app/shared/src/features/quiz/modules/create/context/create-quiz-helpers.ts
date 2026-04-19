import type {
  CreateQuizScope,
  CreateQuizSelection,
} from "@/features/quiz/modules/create/context/create-quiz-context";

export const selectionLabelByScope = {
  course: "Full course",
  chapter: "Chapters",
  topic: "Topics",
  document: "Documents",
} as const;

export const createSelectionForScope = (
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

export const toggleId = (ids: string[], id: string) =>
  ids.includes(id) ? ids.filter((currentId) => currentId !== id) : [...ids, id];

export const getSelectionCount = (selection: CreateQuizSelection) => {
  switch (selection.scope) {
    case "course":
      return 1;
    case "chapter":
      return selection.chapterIds.length;
    case "topic":
      return selection.topicIds.length;
    case "document":
      return selection.documentIds.length;
  }
};

export const getSelectionSummary = (
  selection: CreateQuizSelection,
  canCreate: boolean,
) => {
  if (canCreate) {
    return `${selectionLabelByScope[selection.scope]} selected. Ready to create a quiz draft.`;
  }

  return "Select at least one item for the current scope before creating a quiz.";
};
