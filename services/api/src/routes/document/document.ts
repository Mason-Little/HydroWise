import type { DbClient } from "@hydrowise/database";
import {
  and,
  documentEmbeddings,
  documents,
  eq,
  inArray,
} from "@hydrowise/database";
import {
  CreateDocumentRequestSchema,
  GetEmbeddingsChunksRequestSchema,
} from "@hydrowise/entities";
import { Hono } from "hono";
import { getUserId } from "../../shared/auth";
import { errorResponse } from "../../shared/http";

const createDocumentEntity = (
  userId: string,
  name: string,
  courseId: string | null,
  chapterId: string | null,
  mimeType: string,
  fileSize: number,
  pageCount: number | null,
) => ({
  id: crypto.randomUUID(),
  userId,
  name,
  courseId,
  chapterId,
  mimeType,
  fileSize,
  pageCount,
  createdAt: new Date(),
});

const createDocumentEmbeddingEntity = (
  documentId: string,
  content: string,
  embedding: number[],
  chunkIndex: number,
) => ({
  id: crypto.randomUUID(),
  documentId,
  content,
  embedding,
  chunkIndex,
  createdAt: new Date(),
});

export const createDocumentRoutes = (db: DbClient) => {
  const app = new Hono();

  app.get("/", async (c) => {
    const userId = getUserId();

    const userDocuments = await db.query.documents.findMany({
      where: eq(documents.userId, userId),
    });

    return c.json(userDocuments);
  });

  app.post("/", async (c) => {
    const userId = getUserId();
    const body = await c.req.json().catch(() => null);
    const parseResult = CreateDocumentRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return c.json(errorResponse("invalid input"), 400);
    }

    const payload = parseResult.data;

    const document = createDocumentEntity(
      userId,
      payload.name,
      payload.courseId,
      payload.chapterId,
      payload.mimeType,
      payload.fileSize,
      payload.pageCount ?? null,
    );

    await db.insert(documents).values(document);

    if (payload.embeddings.length > 0) {
      const embeddingRecords = payload.embeddings.map((chunk, index) =>
        createDocumentEmbeddingEntity(
          document.id,
          chunk.content,
          chunk.embedding,
          index,
        ),
      );

      await db.insert(documentEmbeddings).values(embeddingRecords);
    }

    return c.json(
      {
        id: document.id,
        name: document.name,
        courseId: document.courseId,
        chapterId: document.chapterId,
        mimeType: document.mimeType,
        fileSize: document.fileSize,
        pageCount: document.pageCount,
        createdAt: document.createdAt.toISOString(),
        embeddingCount: payload.embeddings.length,
      },
      201,
    );
  });

  app.delete("/:id", async (c) => {
    const userId = getUserId();

    const { id } = c.req.param();

    const existing = await db
      .select({ id: documents.id })
      .from(documents)
      .where(and(eq(documents.id, id), eq(documents.userId, userId)));

    if (!existing[0]) {
      return c.json(errorResponse("document not found"), 404);
    }

    await db
      .delete(documentEmbeddings)
      .where(eq(documentEmbeddings.documentId, id));
    await db
      .delete(documents)
      .where(and(eq(documents.id, id), eq(documents.userId, userId)));

    return c.body(null, 204);
  });

  app.post("/embeddings/by-document", async (c) => {
    const userId = getUserId();
    const body = await c.req.json().catch(() => null);
    const parseResult = GetEmbeddingsChunksRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return c.json(errorResponse("invalid input"), 400);
    }

    const payload = parseResult.data;

    const userDocuments = await db
      .select()
      .from(documents)
      .where(
        and(
          eq(documents.userId, userId),
          inArray(documents.id, payload.documentIds),
        ),
      );

    if (!userDocuments[0]) {
      return c.json(errorResponse("Documents not found"), 404);
    }

    if (userDocuments.length !== payload.documentIds.length) {
      return c.json(errorResponse("Documents not found"), 404);
    }

    const userDocumentIds = userDocuments.map((document) => document.id);

    const embeddings = await db
      .select()
      .from(documentEmbeddings)
      .where(inArray(documentEmbeddings.documentId, userDocumentIds));

    return c.json(embeddings);
  });

  return app;
};
