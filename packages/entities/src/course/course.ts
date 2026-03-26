import { z } from "zod";

export const GradeRubricItemSchema = z.object({
  category: z.string(),
  weight: z.number(),
});

export const GradeScaleItemSchema = z.object({
  letter: z.string(),
  min: z.number().int(),
});

export const TestDateSchema = z.object({
  name: z.string(),
  date: z.string(),
});

export const PolicySchema = z.object({
  label: z.string(),
  summary: z.string(),
});

export const ProfessorInformationSchema = z.object({
  professorName: z.string(),
  professorEmail: z.string(),
  professorOffice: z.string(),
  professorOfficeHours: z.string(),
});

export const CourseSchema = z.object({
  id: z.string(),
  courseName: z.string().min(1),
  courseCode: z.string().min(1),
  term: z.string(),
  credits: z.number().int(),
  prerequisites: z.string(),
  textbook: z.string(),
  schedule: z.string(),
  gradeRubric: z.array(GradeRubricItemSchema),
  gradeScale: z.array(GradeScaleItemSchema),
  testDates: z.array(TestDateSchema),
  professorInformation: ProfessorInformationSchema,
  policies: z.array(PolicySchema),
});

export const CreateCourseInputSchema = CourseSchema.omit({ id: true });

export type GradeRubricItem = z.infer<typeof GradeRubricItemSchema>;
export type GradeScaleItem = z.infer<typeof GradeScaleItemSchema>;
export type TestDate = z.infer<typeof TestDateSchema>;
export type Policy = z.infer<typeof PolicySchema>;
export type ProfessorInformation = z.infer<typeof ProfessorInformationSchema>;
export type Course = z.infer<typeof CourseSchema>;
export type CreateCourseInput = z.infer<typeof CreateCourseInputSchema>;
