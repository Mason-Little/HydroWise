import type { DbClient } from "@hydrowise/database";
import { and, chats, eq, messages } from "@hydrowise/database";
import { MessageCreateInputSchema } from "@hydrowise/entities";
import { Hono } from "hono";

const createChatEntity = (userId: string, chatId: string, name?: string) => ({
  id: chatId,
  userId,
  name: name ?? "New Chat",
});

const getUserId = (c: {
  req: { header: (name: string) => string | undefined };
}) => c.req.header("userId");

const requireUserId = (c: {
  req: { header: (name: string) => string | undefined };
}) => {
  const userId = getUserId(c);
  if (!userId) {
    return { ok: false, error: "userId is required" } as const;
  }
  return { ok: true, userId } as const;
};

export const createChatRoutes = (db: DbClient) => {
  const app = new Hono();

  // GET /chat - list all chats
  app.get("/", async (c) => {
    const user = requireUserId(c);
    if (!user.ok) return c.json(user, 400);
    const result = await db
      .select()
      .from(chats)
      .where(eq(chats.userId, user.userId));
    return c.json({ data: result });
  });

  // POST /chat - create a chat
  app.post("/:chatId", async (c) => {
    const user = requireUserId(c);
    if (!user.ok) return c.json(user, 400);
    const chatId = c.req.param("chatId");
    const chat = createChatEntity(user.userId, chatId);
    await db.insert(chats).values(chat);
    return c.json({ data: chat });
  });

  // GET /chat/:chatId - get single chat
  app.get("/:chatId", async (c) => {
    const user = requireUserId(c);
    if (!user.ok) return c.json(user, 400);
    const chatId = c.req.param("chatId");
    const result = await db
      .select()
      .from(chats)
      .where(and(eq(chats.id, chatId), eq(chats.userId, user.userId)));
    return c.json({ data: result[0] ?? null });
  });

  // GET /chat/:chatId/messages - get chat messages
  app.get("/:chatId/messages", async (c) => {
    const user = requireUserId(c);
    if (!user.ok) return c.json(user, 400);
    const chatId = c.req.param("chatId");
    const chat = await db
      .select({ id: chats.id })
      .from(chats)
      .where(and(eq(chats.id, chatId), eq(chats.userId, user.userId)));
    if (!chat[0]) {
      return c.json({ error: "chat not found" }, 404);
    }
    const result = await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, chatId));
    return c.json({ data: result });
  });

  // DELETE /chat/:chatId - delete a chat
  app.delete("/:chatId", async (c) => {
    const user = requireUserId(c);
    if (!user.ok) return c.json(user, 400);
    const chatId = c.req.param("chatId");
    const chat = await db
      .select({ id: chats.id })
      .from(chats)
      .where(and(eq(chats.id, chatId), eq(chats.userId, user.userId)));
    if (!chat[0]) {
      return c.json({ error: "chat not found" }, 404);
    }
    await db.delete(messages).where(eq(messages.chatId, chatId));
    const result = await db
      .delete(chats)
      .where(and(eq(chats.id, chatId), eq(chats.userId, user.userId)))
      .returning();
    return c.json({ data: result[0] });
  });

  // POST /chat/:chatId/messages - append message
  app.post("/:chatId/messages", async (c) => {
    const user = requireUserId(c);
    if (!user.ok) return c.json(user, 400);
    const chatId = c.req.param("chatId");
    const chat = await db
      .select({ id: chats.id })
      .from(chats)
      .where(and(eq(chats.id, chatId), eq(chats.userId, user.userId)));
    if (!chat[0]) {
      return c.json({ error: "chat not found" }, 404);
    }
    const payload = await c.req.json();
    const parseResult = MessageCreateInputSchema.safeParse(payload);
    if (!parseResult.success) {
      return c.json({ error: "role and content are required" }, 400);
    }
    const messagePayload = parseResult.data;

    const message = {
      id: crypto.randomUUID(),
      chatId,
      role: messagePayload.role,
      content: messagePayload.content,
    };
    await db.insert(messages).values(message);
    return c.json({ data: message });
  });

  return app;
};
