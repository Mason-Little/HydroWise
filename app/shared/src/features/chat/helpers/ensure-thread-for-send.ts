import { getQueries } from "@hydrowise/data";

/** Returns an existing thread id or inserts a new thread with the default title. */
export const ensureThreadForSend = async (currentThreadId: string | null) => {
  if (currentThreadId !== null) {
    return { threadId: currentThreadId, createdNewThread: false };
  }
  const queries = await getQueries();
  const row = await queries.createChatThread();
  return { threadId: row.id, createdNewThread: true };
};
