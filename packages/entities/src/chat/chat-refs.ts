import { z } from "zod";

export const ChatCitationRefSchema = z.object({
  kind: z.literal("citation"),
  documentId: z.string(),
  pageNumber: z.number(),
  excerpt: z.string().nullable(),
});

export const ChatArtifactRefSchema = z.object({
  kind: z.literal("artifact"),
  artifactType: z.enum(["quiz"]),
  artifactId: z.string(),
  label: z.string(),
});

export const ChatRefSchema = z.discriminatedUnion("kind", [
  ChatCitationRefSchema,
  ChatArtifactRefSchema,
]);

export type ChatRef = z.infer<typeof ChatRefSchema>;
