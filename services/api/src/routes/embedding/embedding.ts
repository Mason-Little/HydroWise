import {
  and,
  cosineDistance,
  type DbClient,
  desc,
  documentEmbeddings,
  documents,
  eq,
  sql,
} from "@hydrowise/database";
import {
  CreateEmbeddingRequestSchema,
  RetrieveContextRequestSchema,
} from "@hydrowise/entities";
import { Hono } from "hono";
import { getUserId } from "../../shared/auth";
import { errorResponse } from "../../shared/http";

const createEmbeddingEntity = (
  documentId: string,
  content: string,
  embedding: number[],
  topicId: string | null,
  chunkIndex: number,
  chunkIdea: string,
) => ({
  id: crypto.randomUUID(),
  documentId,
  topicId,
  chunkIdea,
  content,
  embedding,
  chunkIndex,
  createdAt: new Date(),
});

export const createEmbeddingRoutes = (db: DbClient) => {
  const app = new Hono();

  app.post("/create-embedding-chunk", async (c) => {
    const userId = getUserId();
    const body = await c.req.json().catch(() => null);
    const parseResult = CreateEmbeddingRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return c.json(errorResponse("embedding is required"), 400);
    }
    const { documentId, content, embedding, topicId, chunkIndex, chunkIdea } =
      parseResult.data;

    const document = await db.query.documents.findFirst({
      where: and(eq(documents.id, documentId), eq(documents.userId, userId)),
    });

    if (!document) {
      return c.json(errorResponse("document not found"), 404);
    }

    const embeddingChunk = createEmbeddingEntity(
      documentId,
      content,
      embedding,
      topicId,
      chunkIndex,
      chunkIdea,
    );

    const results = await db.insert(documentEmbeddings).values(embeddingChunk);

    return c.json(results);
  });

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
