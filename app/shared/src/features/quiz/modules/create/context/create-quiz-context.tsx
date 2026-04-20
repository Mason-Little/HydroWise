import { createContext, type ReactNode, useContext, useReducer } from "react";
import { useDashboardContext } from "@/features/dashboard/dashboard-context";
import { useQuizContext } from "@/features/quiz/context/quiz-context";
import {
  buildQuizPlannerTree,
  getSelectionCount,
  getSelectionSummary,
} from "@/features/quiz/modules/create/context/create-quiz-helpers";
import {
  createQuizReducer,
  initialCreateQuizState,
} from "@/features/quiz/modules/create/context/create-quiz-reducer";

export type CreateQuizScope = "course" | "chapter" | "topic" | "document";

export type QuizSettings = {
  quizTime: "10" | "15" | "20" | "∞";
  questionAmount: "10" | "20" | "30" | "40";
  difficulty: "Easy" | "Mixed" | "Hard";
  questionType: "Mixed" | "Multiple choice" | "True / false" | "Short answer";
};

export type CreateQuizSelection =
  | {
      scope: "course";
    }
  | {
      scope: "chapter";
      chapterIds: string[];
    }
  | {
      scope: "topic";
      topicIds: string[];
    }
  | {
      scope: "document";
      documentIds: string[];
    };

type CreateQuizContextValue = {
  selection: CreateQuizSelection;
  setScope: (scope: CreateQuizScope) => void;
  toggleChapter: (chapterId: string) => void;
  toggleTopic: (topicId: string) => void;
  toggleDocument: (documentId: string) => void;
  quizSettings: QuizSettings;
  updateQuizSetting: <K extends keyof QuizSettings>(
    key: K,
    value: QuizSettings[K],
  ) => void;
  selectedCount: number;
  canCreate: boolean;
  selectionSummary: string;
  createQuiz: () => void;
};

const CreateQuizContext = createContext<CreateQuizContextValue | null>(null);

type CreateQuizProviderProps = {
  children: ReactNode;
};

export const CreateQuizProvider = ({ children }: CreateQuizProviderProps) => {
  const { activeCourse } = useDashboardContext();
  const { setView } = useQuizContext();
  const [state, dispatch] = useReducer(
    createQuizReducer,
    initialCreateQuizState,
  );

  const { selection, quizSettings } = state;

  const selectedCount = getSelectionCount(selection);
  const canCreate = selection.scope === "course" || selectedCount > 0;
  const selectionSummary = getSelectionSummary(selection, canCreate);

  const setScope = (scope: CreateQuizScope) => {
    dispatch({
      type: "scope/set",
      scope,
    });
  };

  const toggleChapter = (chapterId: string) => {
    dispatch({
      type: "chapter/toggle",
      chapterId,
    });
  };

  const toggleTopic = (topicId: string) => {
    dispatch({
      type: "topic/toggle",
      topicId,
    });
  };

  const toggleDocument = (documentId: string) => {
    dispatch({
      type: "document/toggle",
      documentId,
    });
  };

  const updateQuizSetting = <K extends keyof QuizSettings>(
    key: K,
    value: QuizSettings[K],
  ) => {
    dispatch({
      type: "settings/update",
      key,
      value,
    });
  };

  const createQuiz = () => {
    if (!canCreate) {
      return;
    }

    void (async () => {
      try {
        const tree = await buildQuizPlannerTree(selection, activeCourse.id);
        console.log("quiz planner tree", tree);
      } catch (error) {
        console.error("Failed to build quiz planner tree.", error);
      } finally {
        setView("write");
      }
    })();
  };

  return (
    <CreateQuizContext.Provider
      value={{
        selection,
        setScope,
        toggleChapter,
        toggleTopic,
        toggleDocument,
        quizSettings,
        updateQuizSetting,
        selectedCount,
        canCreate,
        selectionSummary,
        createQuiz,
      }}
    >
      {children}
    </CreateQuizContext.Provider>
  );
};

export const useCreateQuizContext = (): CreateQuizContextValue => {
  const value = useContext(CreateQuizContext);

  if (!value) {
    throw new Error(
      "useCreateQuizContext must be used within a CreateQuizProvider.",
    );
  }

  return value;
};
