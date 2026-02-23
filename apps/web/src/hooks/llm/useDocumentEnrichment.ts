import { parseDocument } from "@hydrowise/core";
import type { Chapter, Course, EmbeddingChunk } from "@hydrowise/entities";
import { sendChunkConcept, sendTopicAssignment } from "@hydrowise/llm-client";
import { useTopicQueries } from "../query/topic.queries";

export const useDocumentEnrichment = () => {
  const { retrieveTopics, createTopic } = useTopicQueries();

  type EnrichedChunk = EmbeddingChunk & {
    chunkIdea: string;
    topicId: string | null;
  };

  const enrichDocumentChunks = async (
    file: File,
    documentName: string,
    course: Course | null,
    chapter: Chapter | null,
  ): Promise<EnrichedChunk[]> => {
    const chunks = await parseDocument(file);

    const chunkConcepts = await Promise.all(
      chunks.map((chunk) =>
        sendChunkConcept(chunk, documentName, course, chapter),
      ),
    );

    const chunksWithConcepts: Array<EmbeddingChunk & { chunkIdea: string }> =
      chunks.map((chunk, index) => ({
        ...chunk,
        chunkIdea: chunkConcepts[index].idea,
      }));

    if (!course) {
      return chunksWithConcepts.map((chunk) => ({
        ...chunk,
        topicId: null,
      }));
    }

    const existingTopics = await retrieveTopics({
      courseId: course.id,
      chapterId: chapter?.id,
    });

    const topicIdeas = await sendTopicAssignment(
      chunksWithConcepts.map(({ chunkIndex, chunkIdea }) => ({
        chunkIndex,
        chunkIdea,
      })),
      course,
      chapter,
      documentName,
      existingTopics.map(({ name, description }) => ({ name, description })),
    );

    const existingByName = new Map(existingTopics.map((t) => [t.name, t]));

    const newTopicDefs = topicIdeas.createTopics.filter(
      (t) => !existingByName.has(t.name),
    );

    const createdTopics = await Promise.all(
      newTopicDefs.map((t) =>
        createTopic({
          name: t.name,
          description: t.description,
          courseId: course.id,
          chapterId: chapter?.id,
        }),
      ),
    );

    const topicIdByName = new Map(
      [...existingTopics, ...createdTopics].map((t) => [t.name, t.id]),
    );

    return chunksWithConcepts.map((chunk) => {
      const topicName = topicIdeas.assignments.find(
        (a) => a.chunkIndex === chunk.chunkIndex,
      )?.topicName;

      const topicId = topicName ? (topicIdByName.get(topicName) ?? null) : null;

      if (!topicId) {
        throw new Error(
          `Missing topicId for chunkIndex ${chunk.chunkIndex}. ` +
            `topicName=${topicName ?? "(none)"}`,
        );
      }

      return { ...chunk, topicId };
    });
  };

  return { enrichDocumentChunks };
};
