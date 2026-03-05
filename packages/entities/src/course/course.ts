import { z } from "zod";

export const GradeRubricItemSchema = z.object({
  category: z.string(),
  weight: z.number(),
});

export const TestDateSchema = z.object({
  name: z.string(),
  date: z.string(),
});

export const ProfessorInformationSchema = z.object({
  professorName: z.string(),
  professorEmail: z.string().email(),
  professorOfficeHours: z.string(),
  professorOfficeDays: z.string(),
});

export const CourseSchema = z.object({
  id: z.string(),
  courseName: z.string().min(1),
  courseCode: z.string().min(1),
  gradeRubric: z.array(GradeRubricItemSchema),
  testDates: z.array(TestDateSchema),
  professorInformation: ProfessorInformationSchema,
});

export const CreateCourseInputSchema = CourseSchema.pick({
  courseName: true,
  courseCode: true,
  gradeRubric: true,
  testDates: true,
  professorInformation: true,
});

export type GradeRubricItem = z.infer<typeof GradeRubricItemSchema>;
export type TestDate = z.infer<typeof TestDateSchema>;
export type ProfessorInformation = z.infer<typeof ProfessorInformationSchema>;
export type Course = z.infer<typeof CourseSchema>;
export type CreateCourseInput = z.infer<typeof CreateCourseInputSchema>;
