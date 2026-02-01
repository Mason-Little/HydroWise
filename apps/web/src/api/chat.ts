import type { Chat } from "@hydrowise/entities";

const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

// TODO: replace with real auth user id
const USER_ID = "1";

const withUserHeaders = (headers: HeadersInit = {}) => ({
  ...headers,
  userId: USER_ID,
});

const jsonHeaders = withUserHeaders({ "Content-Type": "application/json" });

export const getChats = async (): Promise<Chat[]> => {
  const response = await fetch(`${BASE_URL}/chat`, {
    headers: withUserHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch chats");
  }
  return response.json();
};

export const getChat = async (chatId: string) => {
  const response = await fetch(`${BASE_URL}/chat/${chatId}`, {
    headers: withUserHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch chat");
  }
  return response.json();
};

export const createChat = async (name?: string) => {
  const response = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    throw new Error("Failed to create chat");
  }
  return response.json();
};

export const deleteChat = async (chatId: string) => {
  const response = await fetch(`${BASE_URL}/chat/${chatId}`, {
    method: "DELETE",
    headers: withUserHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to delete chat");
  }
  return response.json();
};

export const getMessages = async (chatId: string) => {
  const response = await fetch(`${BASE_URL}/chat/${chatId}/messages`, {
    headers: withUserHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }
  return response.json();
};

export const appendMessage = async (
  chatId: string,
  role: string,
  content: string,
) => {
  const response = await fetch(`${BASE_URL}/chat/${chatId}/messages`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ role, content }),
  });
  if (!response.ok) {
    throw new Error("Failed to append message");
  }
  return response.json();
};
