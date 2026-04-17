import { createContext, type ReactNode, useContext, useState } from "react";

export type CreateQuizScope = "course" | "chapter" | "topic" | "document";

type CreateQuizContextValue = {
  activeScope: CreateQuizScope;
  setActiveScope: (scope: CreateQuizScope) => void;
  selectedChapterIds: string[];
  setSelectedChapterIds: (chapterIds: string[]) => void;
  selectedTopicIds: string[];
  setSelectedTopicIds: (topicIds: string[]) => void;
  selectedDocumentIds: string[];
  setSelectedDocumentIds: (documentIds: string[]) => void;
};

const CreateQuizContext = createContext<CreateQuizContextValue | null>(null);

type CreateQuizProviderProps = {
  children: ReactNode;
};

export const CreateQuizProvider = ({ children }: CreateQuizProviderProps) => {
  const [activeScope, setActiveScope] = useState<CreateQuizScope>("topic");
  const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>([]);
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);

  return (
    <CreateQuizContext.Provider
      value={{
        activeScope,
        setActiveScope,
        selectedChapterIds,
        setSelectedChapterIds,
        selectedTopicIds,
        setSelectedTopicIds,
        selectedDocumentIds,
        setSelectedDocumentIds,
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
