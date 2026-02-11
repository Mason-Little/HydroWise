import { and, type DbClient, eq, topics } from "@hydrowise/database";
import {
  type CreateTopicRequest,
  CreateTopicRequestSchema,
  RetrieveTopicsRequestSchema,
} from "@hydrowise/entities";
import { Hono } from "hono";
import { getUserId } from "../../shared/auth";
import { errorResponse } from "../../shared/http";

const app = new Hono();

const createTopicObject = (body: CreateTopicRequest, userId: string) => {
  return {
    id: crypto.randomUUID(),
    userId,
    courseId: body.courseId,
    chapterId: body?.chapterId,
    name: body.name,
    description: body.description,
    createdAt: new Date(),
  };
};

export const createTopicRoutes = (db: DbClient) => {
  app.post("/retrieve-topics", async (c) => {
    const userId = getUserId();
    const body = await c.req.json().catch(() => null);
    const parseResult = RetrieveTopicsRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return c.json(errorResponse("invalid input"), 400);
    }

    const { chapterId, courseId } = parseResult.data;

    if (chapterId) {
      const courseTopics = await db
        .select()
        .from(topics)
        .where(and(eq(topics.userId, userId), eq(topics.chapterId, chapterId)));
      return c.json(courseTopics);
    } else if (courseId) {
      const courseTopics = await db
        .select()
        .from(topics)
        .where(and(eq(topics.userId, userId), eq(topics.courseId, courseId)));
      return c.json(courseTopics);
    }

    return c.json([]);
  });

  app.post("/create-topic", async (c) => {
    const userId = getUserId();
    const body = await c.req.json().catch(() => null);
    const parseResult = CreateTopicRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return c.json(errorResponse("invalid input"), 400);
    }

    const topic = createTopicObject(parseResult.data, userId);

    await db.insert(topics).values(topic);

    return c.json(topic);
  });

  return app;
};
