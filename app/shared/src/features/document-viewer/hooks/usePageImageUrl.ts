import { useEffect, useMemo } from "react";

export const usePageImageUrl = (
  page: {
    pageImage: Uint8Array | null;
  } | null,
) => {
  const imageUrl = useMemo(() => {
    if (!page?.pageImage) {
      return null;
    }

    return URL.createObjectURL(
      new Blob([new Uint8Array(page.pageImage)], { type: "image/png" }),
    );
  }, [page]);

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  return imageUrl;
};
