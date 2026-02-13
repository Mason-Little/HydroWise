import type {
  ChatMessage,
  CreateChatResponse,
  CreateMessageResponse,
  GetChatsResponse,
  GetMessagesResponse,
  NoContentResponse,
} from "@hydrowise/entities";
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
    return client
      .delete(`chat/${chatId}`)
      .then((): NoContentResponse => undefined);
  },
  sendMessage: (chatId: string, message: ChatMessage) => {
    return client
      .post(`chat/${chatId}/messages`, {
        json: message,
      })
      .json<CreateMessageResponse>();
  },
};
