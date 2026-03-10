export type AiRuntime = "web" | "desktop";

let currentRuntime: AiRuntime = "web";

export function initAiRuntime(runtime: AiRuntime): void {
  currentRuntime = runtime;
}

export function getAiRuntime(): AiRuntime {
  return currentRuntime;
}
