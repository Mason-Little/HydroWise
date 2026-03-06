import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { initData } from "@hydrowise/data";
import { appDataDir, join } from "@tauri-apps/api/path";
import { App } from "@/App";
import type { PlatformConfig } from "@/platform";
import { AppProviders } from "@/providers";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element not found");
}

const bootstrap = async () => {
  const dataDir = await appDataDir();
  const desktopDbDir = await join(dataDir, "hydrowise-db");
  const platform: PlatformConfig = { kind: "desktop", desktopDbDir };

  await initData({ platform: "desktop", desktopDbDir });

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
      <h1>Failed to initialize desktop app</h1>
      <pre>${String(err?.message ?? err)}</pre>
    </div>
  `;
});
