export type AiRuntime = "web" | "desktop";

const ENV_KEY = "VITE_HYDROWISE_AI_RUNTIME";

function readRuntimeEnv(): string | undefined {
  if (typeof process !== "undefined" && process.env?.[ENV_KEY] != null) {
    return process.env[ENV_KEY];
  }
  if (
    typeof import.meta !== "undefined" &&
    (import.meta as unknown as { env?: Record<string, string> }).env?.[ENV_KEY] != null
  ) {
    return (import.meta as unknown as { env: Record<string, string> }).env[ENV_KEY];
  }
  return undefined;
}

export function getAiRuntime(): AiRuntime {
  const raw = readRuntimeEnv();
  if (raw === "web" || raw === "desktop") {
    return raw;
  }
  return "web";
}
