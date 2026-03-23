import type {
  GradeRubricItem,
  GradeScaleItem,
  Policy,
  ProfessorInformation,
  TestDate,
} from "@hydrowise/entities";
import { integer, jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const courses = pgTable("courses", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseName: text("course_name").notNull(),
  courseCode: text("course_code").notNull(),
  term: text("term").notNull().default(""),
  credits: integer("credits").notNull().default(0),
  prerequisites: text("prerequisites").notNull().default(""),
  textbook: text("textbook").notNull().default(""),
  schedule: text("schedule").notNull().default(""),
  gradeRubric: jsonb("grade_rubric").$type<GradeRubricItem[]>().notNull().default([]),
  gradeScale: jsonb("grade_scale").$type<GradeScaleItem[]>().notNull().default([]),
  testDates: jsonb("test_dates").$type<TestDate[]>().notNull().default([]),
  professorInformation: jsonb("professor_information")
    .$type<ProfessorInformation>()
    .notNull(),
  policies: jsonb("policies").$type<Policy[]>().notNull().default([]),
});
