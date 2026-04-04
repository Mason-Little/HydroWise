import { getQueries } from "@hydrowise/data";

export type EnsureThreadForSendResult = {
  threadId: string;
  createdNewThread: boolean;
};

/** Returns an existing thread id or inserts a new thread with the default title. */
export const ensureThreadForSend = async (
  currentThreadId: string | null,
): Promise<EnsureThreadForSendResult> => {
  if (currentThreadId !== null) {
    return { threadId: currentThreadId, createdNewThread: false };
  }
  const queries = await getQueries();
  const row = await queries.createChatThread();
  return { threadId: row.id, createdNewThread: true };
};
