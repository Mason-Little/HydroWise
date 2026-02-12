import type { DbClient } from "@hydrowise/database";
import { and, documentEmbeddings, documents, eq } from "@hydrowise/database";
import { CreateDocumentRequestSchema } from "@hydrowise/entities";
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
) => ({
  id: crypto.randomUUID(),
  userId,
  name,
  courseId,
  chapterId,
  mimeType,
  fileSize,
  embeddingStatus: "pending" as const,
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

    const { name, size, mimeType, courseId, chapterId } = parseResult.data;

    const document = createDocumentEntity(
      userId,
      name,
      courseId,
      chapterId,
      mimeType,
      size,
    );

    await db.insert(documents).values(document);

    return c.json(
      {
        id: document.id,
        name: document.name,
        courseId: document.courseId,
        chapterId: document.chapterId,
        mimeType: document.mimeType,
        fileSize: document.fileSize,
        embeddingStatus: document.embeddingStatus,
        createdAt: document.createdAt.toISOString(),
      },
      201,
    );
  });

  // Delete document
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

  // Update document metadata
  app.put("/status/:id/:status", async (c) => {
    const userId = getUserId();

    const { id, status } = c.req.param();

    if (!["pending", "completed", "failed"].includes(status)) {
      return c.json(errorResponse("invalid status"), 400);
    }

    const existing = await db
      .select({ id: documents.id })
      .from(documents)
      .where(and(eq(documents.id, id), eq(documents.userId, userId)));

    if (!existing[0]) {
      return c.json(errorResponse("document not found"), 404);
    }

    await db
      .update(documents)
      .set({
        embeddingStatus: status as "pending" | "completed" | "failed",
      })
      .where(eq(documents.id, id));

    return c.body(null, 204);
  });

  return app;
};
