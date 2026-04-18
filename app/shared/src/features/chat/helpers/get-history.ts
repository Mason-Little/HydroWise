import { getQueries } from "@hydrowise/data";
import type { ChatHistoryMessage } from "@hydrowise/entities";

export const getChatHistory = async (
  threadId: string,
): Promise<ChatHistoryMessage[]> => {
  const queries = await getQueries();
  const rows = await queries.listChatMessages(threadId);
  return rows.map((m) => ({ role: m.role, text: m.payload.text }));
};
