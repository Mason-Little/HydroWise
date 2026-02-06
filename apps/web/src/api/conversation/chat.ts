import type { Chat, Message } from "@hydrowise/entities";
import type { APIResponse } from "@/api/client";
import { client } from "@/api/client";

export const chatAPI = {
  getAllChats: () => {
    return client.get("chat").json<APIResponse<Chat[]>>();
  },
  getChatMessages: (chatId: string) => {
    return client.get(`chat/${chatId}/messages`).json<APIResponse<Message[]>>();
  },
  createChat: () => {
    return client.post("chat").json<APIResponse<Chat>>();
  },
  deleteChat: (chatId: string) => {
    return client.delete(`chat/${chatId}`).json<APIResponse<Chat>>();
  },
  sendMessage: (chatId: string, message: Message) => {
    return client
      .post(`chat/${chatId}/messages`, {
        json: { message },
      })
      .json<APIResponse<Message>>();
  },
};
