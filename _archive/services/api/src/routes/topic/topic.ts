import {
  and,
  type DbClient,
  documentEmbeddings,
  eq,
  topics,
} from "@hydrowise/database";
import {
  type TopicCreateInput,
  TopicCreateInputSchema,
  TopicQueryInputSchema,
} from "@hydrowise/entities";
import { Hono } from "hono";
import { getUserId } from "../../shared/auth";
import { errorResponse } from "../../shared/http";

const app = new Hono();

const createTopicObject = (body: TopicCreateInput, userId: string) => {
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
    const parseResult = TopicQueryInputSchema.safeParse(body);
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

  app.get("/:topicId/embeddings", async (c) => {
    const userId = getUserId();

    const topicId = c.req.param("topicId");

    const topic = await db.query.topics.findFirst({
      where: and(eq(topics.id, topicId), eq(topics.userId, userId)),
    });

    if (!topic) {
      return c.json(errorResponse("topic not found"), 404);
    }

    const chunks = await db
      .select()
      .from(documentEmbeddings)
      .where(eq(documentEmbeddings.topicId, topicId));

    return c.json(chunks);
  });

  app.post("/create-topic", async (c) => {
    const userId = getUserId();
    const body = await c.req.json().catch(() => null);
    const parseResult = TopicCreateInputSchema.safeParse(body);
    if (!parseResult.success) {
      return c.json(errorResponse("invalid input"), 400);
    }

    const topic = createTopicObject(parseResult.data, userId);

    await db.insert(topics).values(topic);

    return c.json(topic);
  });

  return app;
};
