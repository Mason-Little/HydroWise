import type { Chapter } from "@hydrowise/entities";
import { createContext, useContext } from "react";

type MaterialSelectionBase = {
  courseId: string;
  chapters: Chapter[];
  setActiveChapterId: (chapterId: string) => void;
};

export type MaterialSelectionContextValue =
  | (MaterialSelectionBase & {
      status: "loading";
    })
  | (MaterialSelectionBase & {
      status: "empty";
    })
  | (MaterialSelectionBase & {
      status: "ready";
      activeChapter: Chapter;
    });

export const MaterialSelectionContext =
  createContext<MaterialSelectionContextValue | null>(null);

export const useMaterialSelection = (): MaterialSelectionContextValue => {
  const value = useContext(MaterialSelectionContext);

  if (!value) {
    throw new Error(
      "useMaterialSelection must be used within a MaterialSelectionContext.",
    );
  }

  return value;
};
