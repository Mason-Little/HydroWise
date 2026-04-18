import { create } from "zustand";

export type ThreadSession =
  | {
      status: "draft";
    }
  | {
      status: "active";
      threadId: string;
    };

interface ThreadStore {
  session: ThreadSession;
  activateThread: (threadId: string) => void;
  clearThread: () => void;
}

export const useThreadStore = create<ThreadStore>((set) => ({
  session: { status: "draft" },
  activateThread: (threadId) =>
    set({ session: { status: "active", threadId } }),
  clearThread: () => set({ session: { status: "draft" } }),
}));
