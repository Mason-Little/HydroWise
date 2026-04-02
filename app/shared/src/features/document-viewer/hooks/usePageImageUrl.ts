import { useEffect, useMemo } from "react";

type PageWithOptionalImage =
  | {
      pageImage: Uint8Array | null | undefined;
    }
  | null
  | undefined;

export const usePageImageUrl = (page: PageWithOptionalImage) => {
  const imageUrl = useMemo(() => {
    if (!page?.pageImage) return null;

    return URL.createObjectURL(
      new Blob([new Uint8Array(page.pageImage)], { type: "image/png" }),
    );
  }, [page]);

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  return imageUrl;
};
