import { create } from "zustand";

interface ChatStore {
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  streamingContent: string | null;
  isStreaming: boolean;
  setStreamingContent: (content: string | null) => void;
  appendStreamingChunk: (chunk: string) => void;
  clearStreaming: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  activeChatId: null,
  setActiveChatId: (id) => set({ activeChatId: id }),
  streamingContent: null,
  isStreaming: false,
  setStreamingContent: (content) =>
    set({ streamingContent: content, isStreaming: content !== null }),
  appendStreamingChunk: (chunk) =>
    set((state) => ({
      streamingContent: `${state.streamingContent ?? ""}${chunk}`,
      isStreaming: true,
    })),
  clearStreaming: () => set({ streamingContent: null, isStreaming: false }),
}));
