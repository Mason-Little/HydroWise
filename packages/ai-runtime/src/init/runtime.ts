export type AiRuntime = "web" | "desktop";

let currentRuntime: AiRuntime = "web";

export const initAiRuntime = (runtime: AiRuntime): void => {
  currentRuntime = runtime;
};

export const getAiRuntime = (): AiRuntime => {
  return currentRuntime;
};
