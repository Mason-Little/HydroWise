import type {
  ChatMessage,
  ChatOrchestratorOutput,
  GroundedAssistantMessagePayload,
} from "@hydrowise/entities";
import type { QueryClient } from "@tanstack/react-query";

/** One chat thread as stored in the `["chatThreads"]` query (same shape as `listChatThreads`). */
type ListedChatThread = {
  id: string;
  title: string | null;
  courseId: string | null;
  createdAt: Date;
};

type CacheMessage = ChatMessage & {
  clientStatus?: "sending" | "streaming" | "error";
};

const chatThreadsKey = ["chatThreads"] as const;

export function prependThreadInCache(
  queryClient: QueryClient,
  thread: ListedChatThread,
): void {
  queryClient.setQueryData(
    chatThreadsKey,
    (old: ListedChatThread[] | undefined) => {
      const prev = old ?? [];
      if (prev.some((t) => t.id === thread.id)) {
        return prev;
      }
      return [thread, ...prev];
    },
  );
}

export function patchThreadInCache(
  queryClient: QueryClient,
  threadId: string,
  plan: Pick<ChatOrchestratorOutput, "threadTitle" | "activeCourse">,
): void {
  queryClient.setQueryData(
    chatThreadsKey,
    (old: ListedChatThread[] | undefined) =>
      old?.map((t) => {
        if (t.id !== threadId) {
          return t;
        }
        const next = { ...t };
        if (plan.threadTitle != null) {
          next.title = plan.threadTitle;
        }
        if (plan.activeCourse != null) {
          next.courseId = plan.activeCourse;
        }
        return next;
      }) ?? old,
  );
}

export function createOptimisticChatSendCache(
  queryClient: QueryClient,
  threadId: string,
  tempUserId: string,
  tempAsstId: string,
) {
  const messagesKey = ["chatMessages", threadId] as const;

  const setMessages = (
    updater: (prev: CacheMessage[] | undefined) => CacheMessage[] | undefined,
  ) => {
    queryClient.setQueryData(messagesKey, updater);
  };

  const appendPair = (text: string) => {
    setMessages((old) => {
      const base = old ?? [];
      return [
        ...base,
        {
          id: tempUserId,
          threadId,
          role: "user" as const,
          payload: { kind: "user-text" as const, text },
          clientStatus: "sending" as const,
        },
        {
          id: tempAsstId,
          threadId,
          role: "assistant" as const,
          payload: { kind: "grounded-answer" as const, text: "", refs: [] },
          clientStatus: "streaming" as const,
        },
      ];
    });
  };

  const onChunk = (payload: GroundedAssistantMessagePayload) => {
    setMessages(
      (old) =>
        old?.map((m) =>
          m.id === tempAsstId
            ? { ...m, payload, clientStatus: "streaming" as const }
            : m,
        ) ?? old,
    );
  };

  const replacePlaceholder = (placeholderId: string, message: ChatMessage) => {
    setMessages(
      (old) =>
        old?.map((m) => (m.id === placeholderId ? { ...message } : m)) ?? old,
    );
  };

  const dropAssistantPlaceholder = () => {
    setMessages((old) => old?.filter((m) => m.id !== tempAsstId) ?? old);
  };

  const flagErrorOnPlaceholders = () => {
    setMessages(
      (old) =>
        old?.map((m) =>
          m.id === tempUserId || m.id === tempAsstId
            ? { ...m, clientStatus: "error" as const }
            : m,
        ) ?? old,
    );
  };

  return {
    messagesKey,
    appendPair,
    onChunk,
    swapUser: (message: ChatMessage) => replacePlaceholder(tempUserId, message),
    swapAssistant: (message: ChatMessage) =>
      replacePlaceholder(tempAsstId, message),
    dropAssistantPlaceholder,
    flagErrorOnPlaceholders,
  };
}

export async function invalidateChatSendQueries(
  queryClient: QueryClient,
  threadId: string,
): Promise<void> {
  await queryClient.invalidateQueries({ queryKey: ["chatMessages", threadId] });
  await queryClient.invalidateQueries({ queryKey: chatThreadsKey });
}
