import {
  cosineDistance,
  type DbClient,
  desc,
  documentEmbeddings,
  documents,
  eq,
  sql,
} from "@hydrowise/database";
import { RetrieveContextRequestSchema } from "@hydrowise/entities";
import { Hono } from "hono";
import { getUserId } from "../../shared/auth";
import { errorResponse } from "../../shared/http";

export const createRagRoutes = (db: DbClient) => {
  const app = new Hono();

  app.post("/retrieve-context", async (c) => {
    const userId = getUserId();
    const body = await c.req.json().catch(() => null);
    const parseResult = RetrieveContextRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return c.json(errorResponse("embedding is required"), 400);
    }
    const userEmbedding = parseResult.data.embedding;

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

    return c.json(results);
  });

  return app;
};
