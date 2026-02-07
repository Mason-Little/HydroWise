import type { DbClient } from "@hydrowise/database";
import { documentEmbeddings, documents } from "@hydrowise/database";
import { CreateDocumentRequestSchema } from "@hydrowise/entities";
import { Hono } from "hono";

const getUserId = (c: {
  req: { header: (name: string) => string | undefined };
}) => c.req.header("userId");

const createDocumentEntity = (
  userId: string,
  name: string,
  mimeType: string,
  fileSize: number,
  pageCount: number | null,
) => ({
  id: crypto.randomUUID(),
  userId,
  name,
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

  // POST /document - create a document
  app.post("/", async (c) => {
    const userId = getUserId(c);
    if (!userId) {
      return c.json({ error: "userId is required" }, 400);
    }

    // Parse and validate request body using Zod
    const body = await c.req.json();
    const parseResult = CreateDocumentRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return c.json(
        {
          error: "Invalid request body",
          details: parseResult.error.flatten(),
        },
        400,
      );
    }

    const payload = parseResult.data;

    // Create the document record
    const document = createDocumentEntity(
      userId,
      payload.name,
      payload.mimeType,
      payload.fileSize,
      payload.pageCount ?? null,
    );

    await db.insert(documents).values(document);

    // Create embedding records (if any)
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

    return c.json({
      data: {
        id: document.id,
        name: document.name,
        mimeType: document.mimeType,
        fileSize: document.fileSize,
        pageCount: document.pageCount,
        createdAt: document.createdAt.toISOString(),
        embeddingCount: payload.embeddings.length,
      },
    });
  });

  return app;
};
