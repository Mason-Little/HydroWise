import { initAllEngines } from "@hydrowise/llm-client";
import { create } from "zustand";

interface LLMState {
  state: "cold" | "warming" | "warm" | "error";
  setState: (state: "cold" | "warming" | "warm" | "error") => void;
  progress: number;
  setProgress: (progress: number) => void;
  warmUp: () => Promise<void>;
}
export const useLLMStore = create<LLMState>((set, get) => ({
  state: "cold",
  setState: (state) => set({ state }),
  progress: 0,
  setProgress: (progress) => set({ progress }),
  warmUp: async () => {
    const currentState = get().state;
    if (currentState === "warming" || currentState === "warm") return;
    set({ state: "warming", progress: 0 });
    try {
      await initAllEngines((progress) => set({ progress }));
      set({ state: "warm", progress: 1 });
    } catch (error) {
      console.error("LLM warm up failed", error);
      set({ state: "error" });
    }
  },
}));
