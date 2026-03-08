export type AiRuntime = "web" | "desktop";

export function resolveAiRuntime(): AiRuntime {
  if (typeof window !== "undefined") {
    return "web";
  }

  return "web";
}
