import {
  cosineDistance,
  type DbClient,
  desc,
  documentEmbeddings,
  documents,
  eq,
  sql,
} from "@hydrowise/database";
import { Hono } from "hono";

const app = new Hono();

const getUserId = (c: {
  req: { header: (name: string) => string | undefined };
}) => c.req.header("userId");

export const createRagRoutes = (db: DbClient) => {
  app.post("/retrieve-context", async (c) => {
    const userId = getUserId(c);
    if (!userId) {
      return c.json({ error: "userId is required" }, 400);
    }
    const body = await c.req.json();
    const userEmbedding = body.embedding;
    if (!userEmbedding) {
      return c.json({ error: "embedding is required" }, 400);
    }

    const similarity = sql<number>`1 - (${cosineDistance(
      documentEmbeddings.embedding,
      userEmbedding,
    )})`;

    const results = await db
      .select({
        content: documentEmbeddings.content,
        similarity,
      })
      .from(documentEmbeddings)
      .innerJoin(documents, eq(documentEmbeddings.documentId, documents.id))
      .where(eq(documents.userId, userId))
      .orderBy(desc(similarity))
      .limit(5);

    return c.json({ data: results });
  });

  return app;
};
