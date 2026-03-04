import { z } from "zod";

const NonEmptyStringSchema = z.string().min(1);

export const CreateCourseScheduleSchema = z.object({
  days: z
    .array(NonEmptyStringSchema)
    .describe("Days of the week, e.g. ['Monday', 'Wednesday']"),
  startTime: NonEmptyStringSchema.describe("ISO 24h time, e.g. '09:30'"),
  endTime: NonEmptyStringSchema.describe("ISO 24h time, e.g. '10:45'"),
});

export type CreateCourseSchedule = z.infer<typeof CreateCourseScheduleSchema>;

export const CreateCourseTermSchema = z.object({
  startDate: NonEmptyStringSchema.describe("ISO date, e.g. '2025-08-28'"),
  endDate: NonEmptyStringSchema.describe("ISO date, e.g. '2025-12-12'"),
});

export type CreateCourseTerm = z.infer<typeof CreateCourseTermSchema>;

export const CreateCourseLocationSchema = z.object({
  building: NonEmptyStringSchema.describe("Building name, e.g. 'Science Hall'"),
  room: NonEmptyStringSchema.describe("Room number, e.g. '204'"),
});

export type CreateCourseLocation = z.infer<typeof CreateCourseLocationSchema>;

export const CreateCourseInstructorSchema = z.object({
  name: NonEmptyStringSchema.describe(
    "Instructor full name, e.g. 'Dr. Rivera'",
  ),
  email: NonEmptyStringSchema.describe(
    "Instructor email, e.g. 'rivera@univ.edu'",
  ),
});

export type CreateCourseInstructor = z.infer<
  typeof CreateCourseInstructorSchema
>;

export const CreateCourseGradingItemSchema = z.object({
  category: NonEmptyStringSchema.describe(
    "Grading category, e.g. 'Midterm Exam'",
  ),
  weight: z.number().min(0).max(100).describe("Percentage weight, e.g. 25"),
});

export type CreateCourseGradingItem = z.infer<
  typeof CreateCourseGradingItemSchema
>;

export const CreateCourseAssessmentSchema = z.object({
  name: NonEmptyStringSchema.describe(
    "Assessment name, e.g. 'Quiz 1 (Cell Structure)'",
  ),
  type: z
    .enum(["quiz", "midterm", "final", "exam"])
    .describe("Assessment type"),
  date: NonEmptyStringSchema.describe("ISO date, e.g. '2025-09-12'"),
  startTime: NonEmptyStringSchema.describe("ISO 24h time, e.g. '09:30'"),
  endTime: NonEmptyStringSchema.describe("ISO 24h time, e.g. '10:00'"),
});

export type CreateCourseAssessment = z.infer<
  typeof CreateCourseAssessmentSchema
>;

export const CreateCourseTopicSchema = z.object({
  name: NonEmptyStringSchema.describe("Topic name, e.g. 'Cell Structure'"),
  description: NonEmptyStringSchema.describe("Brief topic description"),
});

export type CreateCourseTopic = z.infer<typeof CreateCourseTopicSchema>;

export const CreateCourseResultSchema = z.object({
  courseName: NonEmptyStringSchema.describe("Course title, e.g. 'Biology'"),
  courseNumber: NonEmptyStringSchema.describe("Course number, e.g. '101'"),
  courseDescription: NonEmptyStringSchema.describe(
    "Generated course description",
  ),
  schedule: CreateCourseScheduleSchema,
  term: CreateCourseTermSchema,
  location: CreateCourseLocationSchema,
  instructor: CreateCourseInstructorSchema,
  gradingRubric: z.array(CreateCourseGradingItemSchema),
  assessments: z.array(CreateCourseAssessmentSchema),
  courseTopics: z.array(CreateCourseTopicSchema),
});

export type CreateCourseResult = z.infer<typeof CreateCourseResultSchema>;
