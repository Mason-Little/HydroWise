import type {
  CreateQuizScope,
  CreateQuizSelection,
  QuizSettings,
} from "@/features/quiz/modules/create/context/create-quiz-context";
import {
  createSelectionForScope,
  toggleId,
} from "@/features/quiz/modules/create/context/create-quiz-helpers";

export type CreateQuizState = {
  selection: CreateQuizSelection;
  quizSettings: QuizSettings;
};

export type CreateQuizAction =
  | {
      type: "scope/set";
      scope: CreateQuizScope;
    }
  | {
      type: "chapter/toggle";
      chapterId: string;
    }
  | {
      type: "topic/toggle";
      topicId: string;
    }
  | {
      type: "document/toggle";
      documentId: string;
    }
  | {
      type: "settings/update";
      key: keyof QuizSettings;
      value: QuizSettings[keyof QuizSettings];
    };

export const initialCreateQuizState: CreateQuizState = {
  selection: { scope: "course" } as const,
  quizSettings: {
    quizTime: "10",
    questionAmount: "20",
    difficulty: "Mixed",
    questionType: "Mixed",
  },
};

const toggleSelectionForScope = (
  selection: CreateQuizSelection,
  scope: "chapter" | "topic" | "document",
  id: string,
): CreateQuizSelection => {
  switch (scope) {
    case "chapter":
      if (selection.scope !== "chapter") {
        return selection;
      }

      return {
        scope: "chapter",
        chapterIds: toggleId(selection.chapterIds, id),
      };
    case "topic":
      if (selection.scope !== "topic") {
        return selection;
      }

      return {
        scope: "topic",
        topicIds: toggleId(selection.topicIds, id),
      };
    case "document":
      if (selection.scope !== "document") {
        return selection;
      }

      return {
        scope: "document",
        documentIds: toggleId(selection.documentIds, id),
      };
  }
};

export const createQuizReducer = (
  state: CreateQuizState,
  action: CreateQuizAction,
): CreateQuizState => {
  switch (action.type) {
    case "scope/set":
      return {
        ...state,
        selection: createSelectionForScope(action.scope),
      };
    case "chapter/toggle":
      return {
        ...state,
        selection: toggleSelectionForScope(
          state.selection,
          "chapter",
          action.chapterId,
        ),
      };
    case "topic/toggle":
      return {
        ...state,
        selection: toggleSelectionForScope(
          state.selection,
          "topic",
          action.topicId,
        ),
      };
    case "document/toggle":
      return {
        ...state,
        selection: toggleSelectionForScope(
          state.selection,
          "document",
          action.documentId,
        ),
      };
    case "settings/update":
      return {
        ...state,
        quizSettings: {
          ...state.quizSettings,
          [action.key]: action.value,
        },
      };
    default:
      return state;
  }
};
