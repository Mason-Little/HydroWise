import type {
  CreateChatResponse,
  CreateMessageResponse,
  GetChatsResponse,
  GetMessagesResponse,
  MessageCreateInput,
} from "@hydrowise/entities";
import type { APIResponse } from "@/api/client";
import { client } from "@/api/client";

export const chatAPI = {
  getAllChats: () => {
    return client.get("chat").json<GetChatsResponse>();
  },
  getChatMessages: (chatId: string) => {
    return client.get(`chat/${chatId}/messages`).json<GetMessagesResponse>();
  },
  createChat: () => {
    return client.post("chat").json<CreateChatResponse>();
  },
  deleteChat: (chatId: string) => {
    return client.delete(`chat/${chatId}`).json<APIResponse<{ id: string }>>();
  },
  sendMessage: (chatId: string, message: MessageCreateInput) => {
    return client
      .post(`chat/${chatId}/messages`, {
        json: message,
      })
      .json<CreateMessageResponse>();
  },
};
