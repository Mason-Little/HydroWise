import type { DbClient } from "@hydrowise/database";
import { and, chapters, courses, documents, eq } from "@hydrowise/database";
import {
  type CourseCreateInput,
  CourseCreateInputSchema,
} from "@hydrowise/entities";
import { Hono } from "hono";
import { getUserId } from "../../shared/auth";
import { errorResponse } from "../../shared/http";

const createCourseDBInput = (course: CourseCreateInput, userId: string) => {
  return {
    id: crypto.randomUUID(),
    userId,
    name: course.name,
    number: course.number,
    startDate: course.startDate,
    endDate: course.endDate,
    status: "active" as const,
    createdAt: new Date(),
  };
};

export const createCourseRoutes = (db: DbClient) => {
  const app = new Hono();

  app.get("/", async (c) => {
    const userId = getUserId();

    const result = await db
      .select()
      .from(courses)
      .where(eq(courses.userId, userId));

    return c.json(result);
  });

  app.get("/:id", async (c) => {
    const userId = getUserId();
    const courseId = c.req.param("id");
    const result = await db
      .select()
      .from(courses)
      .where(and(eq(courses.id, courseId), eq(courses.userId, userId)));

    if (!result[0]) {
      return c.json(errorResponse("course not found"), 404);
    }

    return c.json(result[0]);
  });

  app.post("/", async (c) => {
    const userId = getUserId();
    const body = await c.req.json().catch(() => null);
    const parseResult = CourseCreateInputSchema.safeParse(body);
    if (!parseResult.success) {
      return c.json(errorResponse("invalid input"), 400);
    }

    const course = createCourseDBInput(parseResult.data, userId);

    await db.insert(courses).values(course);

    return c.json(
      { ...course, createdAt: course.createdAt.toISOString() },
      201,
    );
  });

  app.delete("/:id", async (c) => {
    const userId = getUserId();
    const courseId = c.req.param("id");
    const course = await db
      .select()
      .from(courses)
      .where(and(eq(courses.id, courseId), eq(courses.userId, userId)));
    if (!course[0]) {
      return c.json(errorResponse("course not found"), 404);
    }
    // Unregister documents
    await db
      .update(documents)
      .set({ courseId: null, chapterId: null })
      .where(eq(documents.courseId, courseId));
    // Delete chapters
    await db.delete(chapters).where(eq(chapters.courseId, courseId));
    // Delete course
    await db
      .delete(courses)
      .where(and(eq(courses.id, courseId), eq(courses.userId, userId)))
      .returning();

    return c.body(null, 204);
  });

  return app;
};
