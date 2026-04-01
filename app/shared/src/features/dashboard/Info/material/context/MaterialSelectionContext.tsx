import type { Chapter } from "@hydrowise/entities";
import { createContext, useContext } from "react";

type MaterialSelectionContextValue = {
  activeChapter: Chapter | null;
  setActiveChapterId: (chapterId: string) => void;
  chapters: Chapter[];
  isLoading: boolean;
  courseId: string;
};

export const MaterialSelectionContext =
  createContext<MaterialSelectionContextValue>({
    activeChapter: null,
    setActiveChapterId: () => {},
    chapters: [],
    isLoading: false,
    courseId: "",
  });

export const useMaterialSelection = (): MaterialSelectionContextValue =>
  useContext(MaterialSelectionContext);
