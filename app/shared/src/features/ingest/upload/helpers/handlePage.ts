import { embedTexts } from "@hydrowise/ai-runtime";
import { getQueries } from "@hydrowise/data";

export type PageDraft = {
  blob: Blob;
  ocrText: string;
  abstract: string;
};

export const handlePages = async (documentId: string, drafts: PageDraft[]) => {
  const queries = await getQueries();
  const texts = drafts.map((d) => d.ocrText);
  const [embeddings, pageImages] = await Promise.all([
    embedTexts(texts),
    Promise.all(
      drafts.map((draft) =>
        draft.blob.arrayBuffer().then((buf) => new Uint8Array(buf)),
      ),
    ),
  ]);

  return Promise.all(
    drafts.map((draft, index) =>
      queries.createPage({
        documentId,
        pageAbstract: draft.abstract,
        pageContent: draft.ocrText,
        pageImage: pageImages[index],
        pageEmbedding: embeddings[index],
        pageNumber: index + 1,
      }),
    ),
  );
};
