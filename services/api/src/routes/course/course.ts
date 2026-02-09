import type { DbClient } from "@hydrowise/database";
import { and, courses, eq } from "@hydrowise/database";
import {
  type CourseCreateInput,
  CourseCreateInputSchema,
} from "@hydrowise/entities";
import { Hono } from "hono";

const getUserId = (c: {
  req: { header: (name: string) => string | undefined };
}) => c.req.header("userId");

const requireUserId = (c: {
  req: { header: (name: string) => string | undefined };
}) => {
  const userId = getUserId(c);
  if (!userId) {
    return { ok: false, error: "userId is required" } as const;
  }
  return { ok: true, userId } as const;
};

const createCourseDBInput = (course: CourseCreateInput, userId: string) => {
  return {
    id: crypto.randomUUID(),
    userId,
    name: course.name,
    number: course.number,
    startDate: course.startDate,
    endDate: course.endDate,
    chapters: course.chapters.map((chapter, index) => {
      return {
        id: crypto.randomUUID(),
        title: chapter,
        order: index + 1,
      };
    }),
    status: "active" as const,
    createdAt: new Date(),
  };
};

export const createCourseRoutes = (db: DbClient) => {
  const app = new Hono();

  app.get("/", async (c) => {
    const user = requireUserId(c);
    if (!user.ok) {
      return c.json({ error: user.error }, 400);
    }

    const result = await db
      .select()
      .from(courses)
      .where(eq(courses.userId, user.userId));

    return c.json({ data: result });
  });

  // create course
  app.post("/", async (c) => {
    const user = requireUserId(c);
    if (!user.ok) {
      return c.json({ error: user.error }, 400);
    }

    const body = await c.req.json();
    const parseResult = CourseCreateInputSchema.safeParse(body);
    if (!parseResult.success) {
      console.log(parseResult.error);
      return c.json({ error: "invalid input" }, 400);
    }

    const course = createCourseDBInput(parseResult.data, user.userId);

    await db.insert(courses).values(course);

    return c.json({
      data: { ...course, createdAt: course.createdAt.toISOString() },
    });
  });

  app.delete("/:id", async (c) => {
    const user = requireUserId(c);
    if (!user.ok) {
      return c.json({ error: user.error }, 400);
    }

    const courseId = c.req.param("id");
    const deleted = await db
      .delete(courses)
      .where(and(eq(courses.id, courseId), eq(courses.userId, user.userId)))
      .returning();

    if (!deleted[0]) {
      return c.json({ error: "course not found" }, 404);
    }

    return c.json({ data: deleted[0] });
  });

  return app;
};
