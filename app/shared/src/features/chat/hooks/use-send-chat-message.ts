import { getQueries } from "@hydrowise/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  createOptimisticChatSendCache,
  invalidateChatSendQueries,
  patchThreadInCache,
  prependThreadInCache,
} from "@/features/chat/helpers/chat-send-message-cache";
import { sendChatTurn } from "@/features/chat/helpers/send-chat-turn";
import { useThreadStore } from "@/store/threadStore";

export const useSendChatMessage = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (text: string) => {
      const { activeThreadId, setActiveThread } = useThreadStore.getState();

      const threadId =
        activeThreadId ??
        (await (async (): Promise<string> => {
          const queries = await getQueries();
          const thread = await queries.createChatThread();
          prependThreadInCache(queryClient, thread);
          setActiveThread(thread.id);
          return thread.id;
        })());

      const tempUserId = `local-user-${crypto.randomUUID()}`;
      const tempAsstId = `local-assistant-${crypto.randomUUID()}`;
      const cache = createOptimisticChatSendCache(
        queryClient,
        threadId,
        tempUserId,
        tempAsstId,
      );

      await queryClient.cancelQueries({ queryKey: cache.messagesKey });
      cache.appendPair(text);

      try {
        const { hadAssistant } = await sendChatTurn({
          threadId,
          text,
          onAssistantChunk: cache.onChunk,
          onUserPersisted: cache.swapUser,
          onThreadSynced: (plan) =>
            patchThreadInCache(queryClient, threadId, plan),
          onAssistantPersisted: cache.swapAssistant,
        });

        if (!hadAssistant) {
          cache.dropAssistantPlaceholder();
        }

        return { threadId };
      } catch (err) {
        cache.flagErrorOnPlaceholders();
        throw err;
      } finally {
        await invalidateChatSendQueries(queryClient, threadId);
      }
    },
  });

  const sendMessage = useCallback(
    (t: string) => {
      if (isPending) {
        return;
      }
      void mutateAsync(t);
    },
    [isPending, mutateAsync],
  );

  return { sendMessage, isStreaming: isPending };
};
