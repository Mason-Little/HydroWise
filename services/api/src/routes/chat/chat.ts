import type { DbClient } from "@hydrowise/database";
import { and, chats, eq, messages } from "@hydrowise/database";
import {
  ChatCreateInputSchema,
  MessageCreateInputSchema,
} from "@hydrowise/entities";
import { Hono } from "hono";
import { getUserId } from "../../shared/auth";
import { errorResponse } from "../../shared/http";

const createChatEntity = (userId: string, name?: string) => ({
  id: crypto.randomUUID(),
  userId,
  name: name ?? "New Chat",
  createdAt: new Date(),
});

export const createChatRoutes = (db: DbClient) => {
  const app = new Hono();

  app.get("/", async (c) => {
    const userId = getUserId();
    const result = await db
      .select()
      .from(chats)
      .where(eq(chats.userId, userId));
    return c.json(result);
  });

  app.post("/", async (c) => {
    const userId = getUserId();
    const payload = await c.req.json().catch(() => null);
    const parseResult = ChatCreateInputSchema.safeParse(payload);
    if (!parseResult.success) {
      return c.json(errorResponse("invalid input"), 400);
    }

    const chat = createChatEntity(userId, parseResult.data.name);
    await db.insert(chats).values(chat);
    return c.json({ ...chat, createdAt: chat.createdAt.toISOString() }, 201);
  });

  app.get("/:chatId", async (c) => {
    const userId = getUserId();
    const chatId = c.req.param("chatId");
    const result = await db
      .select()
      .from(chats)
      .where(and(eq(chats.id, chatId), eq(chats.userId, userId)));

    if (!result[0]) {
      return c.json(errorResponse("chat not found"), 404);
    }

    return c.json(result[0]);
  });

  app.get("/:chatId/messages", async (c) => {
    const userId = getUserId();
    const chatId = c.req.param("chatId");
    const chat = await db
      .select({ id: chats.id })
      .from(chats)
      .where(and(eq(chats.id, chatId), eq(chats.userId, userId)));
    if (!chat[0]) {
      return c.json(errorResponse("chat not found"), 404);
    }
    const result = await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, chatId));
    return c.json(result);
  });

  app.delete("/:chatId", async (c) => {
    const userId = getUserId();
    const chatId = c.req.param("chatId");
    const chat = await db
      .select({ id: chats.id })
      .from(chats)
      .where(and(eq(chats.id, chatId), eq(chats.userId, userId)));
    if (!chat[0]) {
      return c.json(errorResponse("chat not found"), 404);
    }
    await db.delete(messages).where(eq(messages.chatId, chatId));
    await db
      .delete(chats)
      .where(and(eq(chats.id, chatId), eq(chats.userId, userId)));
    return c.body(null, 204);
  });

  app.post("/:chatId/messages", async (c) => {
    const userId = getUserId();
    const chatId = c.req.param("chatId");
    const chat = await db
      .select({ id: chats.id })
      .from(chats)
      .where(and(eq(chats.id, chatId), eq(chats.userId, userId)));
    if (!chat[0]) {
      return c.json(errorResponse("chat not found"), 404);
    }
    const payload = await c.req.json().catch(() => null);
    const parseResult = MessageCreateInputSchema.safeParse(payload);
    if (!parseResult.success) {
      return c.json(errorResponse("role and content are required"), 400);
    }
    const messagePayload = parseResult.data;

    const message = {
      id: crypto.randomUUID(),
      chatId,
      role: messagePayload.role,
      content: messagePayload.content,
      createdAt: new Date(),
    };
    await db.insert(messages).values(message);
    return c.json(
      { ...message, createdAt: message.createdAt.toISOString() },
      201,
    );
  });

  return app;
};
