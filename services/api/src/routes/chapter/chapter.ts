import {
  and,
  asc,
  chapters,
  courses,
  type DbClient,
  eq,
  max,
} from "@hydrowise/database";
import {
  type ChapterCreateInput,
  ChapterCreateInputSchema,
} from "@hydrowise/entities";
import { Hono } from "hono";
import { getUserId } from "../../shared/auth";
import { errorResponse } from "../../shared/http";

const createChapterDBInput = (
  chapter: ChapterCreateInput,
  userId: string,
  maxOrder: number,
) => {
  return {
    id: crypto.randomUUID(),
    userId,
    name: chapter.name,
    courseId: chapter.courseId,
    order: maxOrder + 1,
    createdAt: new Date(),
  };
};

export const createChapterRoutes = (db: DbClient) => {
  const app = new Hono();

  app.get("/:courseId", async (c) => {
    const userId = getUserId();
    const courseId = c.req.param("courseId");
    const chaptersForCourse = await db
      .select()
      .from(chapters)
      .where(and(eq(chapters.courseId, courseId), eq(chapters.userId, userId)))
      .orderBy(asc(chapters.order));
    return c.json(chaptersForCourse);
  });

  app.post("/", async (c) => {
    const userId = getUserId();
    const body = await c.req.json().catch(() => null);
    const parseResult = ChapterCreateInputSchema.safeParse(body);

    if (!parseResult.success) {
      return c.json(errorResponse("invalid input"), 400);
    }

    const course = await db
      .select()
      .from(courses)
      .where(
        and(
          eq(courses.id, parseResult.data.courseId),
          eq(courses.userId, userId),
        ),
      );
    if (!course[0]) {
      return c.json(errorResponse("course not found"), 404);
    }

    const maxOrderResult = await db
      .select({ maxOrder: max(chapters.order) })
      .from(chapters)
      .where(eq(chapters.courseId, parseResult.data.courseId));

    const chapter = createChapterDBInput(
      parseResult.data,
      userId,
      maxOrderResult[0]?.maxOrder ?? 0,
    );

    await db.insert(chapters).values(chapter);

    return c.json(
      { ...chapter, createdAt: chapter.createdAt.toISOString() },
      201,
    );
  });

  app.delete("/:chapterId", async (c) => {
    const userId = getUserId();
    const chapterId = c.req.param("chapterId");
    const chapter = await db
      .select()
      .from(chapters)
      .where(and(eq(chapters.id, chapterId), eq(chapters.userId, userId)));
    if (!chapter[0]) {
      return c.json(errorResponse("chapter not found"), 404);
    }
    await db.delete(chapters).where(eq(chapters.id, chapterId));
    return c.body(null, 204);
  });

  return app;
};
