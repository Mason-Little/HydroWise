import { getQueries } from "@hydrowise/data";
import type { ChatMessage, CreateChatMessageInput } from "@hydrowise/entities";

export const persistChatMessage = async (
  input: CreateChatMessageInput,
): Promise<ChatMessage> => {
  const queries = await getQueries();
  return queries.createChatMessage(input);
};
