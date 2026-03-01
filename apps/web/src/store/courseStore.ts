import { create } from "zustand";

interface CourseStore {
  selectedCourseId: string | null;
  setSelectedCourseId: (courseId: string | null) => void;
}

export const useCourseStore = create<CourseStore>((set) => ({
  selectedCourseId: null,
  setSelectedCourseId: (courseId: string | null) =>
    set({ selectedCourseId: courseId }),
}));
