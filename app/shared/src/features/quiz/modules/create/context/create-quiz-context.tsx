import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useState,
} from "react";

export type CreateQuizScope = "course" | "chapter" | "topic" | "document";

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
  setSelection: Dispatch<SetStateAction<CreateQuizSelection>>;
};

const CreateQuizContext = createContext<CreateQuizContextValue | null>(null);

type CreateQuizProviderProps = {
  children: ReactNode;
};

export const CreateQuizProvider = ({ children }: CreateQuizProviderProps) => {
  const [selection, setSelection] = useState<CreateQuizSelection>({
    scope: "course",
  });

  return (
    <CreateQuizContext.Provider
      value={{
        selection,
        setSelection,
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
