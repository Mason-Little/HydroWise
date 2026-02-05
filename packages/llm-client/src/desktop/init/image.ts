export const initDesktopVisionModel = async (
  onProgress?: (progress: number) => void,
) => {
  const endpoint = import.meta.env.VITE_DESKTOP_VISION_ENDPOINT;

  if (!endpoint) {
    throw new Error("VITE_DESKTOP_VISION_ENDPOINT is not defined");
  }

  const response = await fetch(`${endpoint}/health`);
  const health = await response.json();
  if (health.status === "ok") {
    onProgress?.(100);
  } else {
    throw new Error("Desktop Vision Model is not healthy");
  }
};
