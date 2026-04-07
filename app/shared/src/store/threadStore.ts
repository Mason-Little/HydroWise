import { create } from "zustand";

interface ThreadStore {
  activeThreadId: string | null;
  setActiveThread: (threadId: string | null) => void;
}

export const useThreadStore = create<ThreadStore>((set) => ({
  activeThreadId: null,
  setActiveThread: (threadId) => set({ activeThreadId: threadId }),
}));
