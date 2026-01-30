export const initDesktopLLMClient = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_DESKTOP_ENDPOINT}/health`,
  );
  const health = await response.json();

  console.log(health);
};
