import { env } from "@huggingface/transformers";

// silence third party logs

export const llmLog = {
  error: (message: string, context?: Record<string, unknown>) => {
    console.error(`[llm-client] ${message}`, context ?? "");
  },
  warn: (message: string, context?: Record<string, unknown>) => {
    console.warn(`[llm-client] ${message}`, context ?? "");
  },
  info: (message: string, context?: Record<string, unknown>) => {
    console.info(`[llm-client] ${message}`, context ?? "");
  },
  debug: (message: string, context?: Record<string, unknown>) => {
    console.debug(`[llm-client] ${message}`, context ?? "");
  },
};

let didConfigureWebModelLogging = false;

const shouldSuppressThirdPartyWarning = (args: unknown[]): boolean => {
  return args.some(
    (arg) =>
      typeof arg === "string" &&
      (arg.includes(
        "Unable to determine content-length from response headers",
      ) ||
        arg.includes("VerifyEachNodeIsAssignedToAnEp") ||
        arg.includes("session_state.cc:1280") ||
        arg.includes("session_state.cc:1282")),
  );
};

export const configureWebModelLogging = () => {
  if (didConfigureWebModelLogging) return;
  didConfigureWebModelLogging = true;

  // 1. Configure package-level logging (preferred)
  const onnxBackend = (env as { backends?: Record<string, unknown> }).backends
    ?.onnx as
    | {
        env?: { logLevel?: string; debug?: boolean };
        logLevel?: string;
        debug?: boolean;
        wasm?: { logLevel?: string; debug?: boolean };
      }
    | undefined;

  const targets = [onnxBackend, onnxBackend?.env, onnxBackend?.wasm];
  for (const target of targets) {
    if (!target) continue;
    target.logLevel = "error";
    target.debug = false;
  }

  // 2. Add fallback suppression for persistent/WASM logs
  const originalWarn = console.warn.bind(console);
  const originalError = console.error.bind(console);

  console.warn = (...args: unknown[]) => {
    if (shouldSuppressThirdPartyWarning(args)) return;
    originalWarn(...args);
  };

  console.error = (...args: unknown[]) => {
    if (shouldSuppressThirdPartyWarning(args)) return;
    originalError(...args);
  };
};
