export const initDesktopLLMClient = async (
  onProgress?: (progress: number) => void,
) => {
  const endpoint = import.meta.env.VITE_DESKTOP_GEN_ENDPOINT;

  if (!endpoint) {
    throw new Error("VITE_DESKTOP_GEN_ENDPOINT is not defined");
  }

  const response = await fetch(`${endpoint}/health`);
  const health = await response.json();
  if (health.status === "ok") {
    onProgress?.(100);
  } else {
    throw new Error("Desktop LLM client is not healthy");
  }
};
