import type { QuizQuestion } from "@hydrowise/entities";
import { create } from "zustand";

interface QuizStore {
  currentQuiz: QuizQuestion[] | null;
  setCurrentQuiz: (quiz: QuizQuestion[] | null) => void;
}

export const useQuizStore = create<QuizStore>((set) => ({
  currentQuiz: null,
  setCurrentQuiz: (quiz: QuizQuestion[] | null) => set({ currentQuiz: quiz }),
}));
