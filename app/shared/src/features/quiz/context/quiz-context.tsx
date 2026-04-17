import { createContext, type ReactNode, useContext, useState } from "react";

export type QuizView = "create" | "history" | "write";
export type QuizScope = "course" | "chapter" | "topic" | "document";

type QuizContextValue = {
  view: QuizView;
  setView: (view: QuizView) => void;
  activeScope: QuizScope;
  setActiveScope: (scope: QuizScope) => void;
};

const QuizContext = createContext<QuizContextValue | null>(null);

type QuizProviderProps = {
  children: ReactNode;
};

export const QuizProvider = ({ children }: QuizProviderProps) => {
  const [view, setView] = useState<QuizView>("create");
  const [activeScope, setActiveScope] = useState<QuizScope>("topic");

  return (
    <QuizContext.Provider
      value={{
        view,
        setView,
        activeScope,
        setActiveScope,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuizContext = (): QuizContextValue => {
  const value = useContext(QuizContext);

  if (!value) {
    throw new Error("useQuizContext must be used within a QuizProvider.");
  }

  return value;
};
