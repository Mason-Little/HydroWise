export const initDesktopLLMClient = async (
  onProgress?: (progress: number) => void,
) => {
  const response = await fetch(
    `${import.meta.env.VITE_DESKTOP_GEN_ENDPOINT}/health`,
  );
  const health = await response.json();
  if (health.status === "ok") {
    onProgress?.(100);
  } else {
    throw new Error("Desktop LLM client is not healthy");
  }
};
