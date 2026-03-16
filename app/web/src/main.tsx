import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { initAiRuntime } from "@hydrowise/ai-runtime";
import { initData } from "@hydrowise/data";
import { initEmbeddingsRuntime } from "@hydrowise/embeddings";
import { App } from "@/App";
import type { PlatformConfig } from "@/platform";
import { AppProviders } from "@/providers";
import { bootstrapModelStore } from "@/store/modelStore";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element not found");
}

// Initializes web AI runtime and data, then mounts the app.
const bootstrap = async () => {
  const platform: PlatformConfig = { kind: "web" };

  await initAiRuntime("web");
  await initEmbeddingsRuntime("web");
  await bootstrapModelStore();
  await initData({ platform: "web" });

  createRoot(root).render(
    <StrictMode>
      <AppProviders platform={platform}>
        <App />
      </AppProviders>
    </StrictMode>,
  );
};

bootstrap().catch((err) => {
  root.innerHTML = `
    <div style="padding: 2rem; font-family: system-ui; color: #c00;">
      <h1>Failed to initialize web app</h1>
      <pre>${String(err?.message ?? err)}</pre>
    </div>
  `;
});
