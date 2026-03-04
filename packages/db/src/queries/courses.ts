import type { CreateCourseInput } from "@hydrowise/entities";
import { eq } from "drizzle-orm";
import type { DbClient } from "../client";
import { courses } from "../schema";

export async function createCourse(db: DbClient, input: CreateCourseInput) {
  const [course] = await db.insert(courses).values(input).returning();

  return course;
}

export async function listCourses(db: DbClient) {
  return db.select().from(courses);
}

export async function getCourseById(db: DbClient, id: string) {
  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.id, id))
    .limit(1);
  return course ?? null;
}

export async function deleteCourse(db: DbClient, id: string) {
  const [course] = await db
    .delete(courses)
    .where(eq(courses.id, id))
    .returning({ id: courses.id });

  return course ?? null;
}
