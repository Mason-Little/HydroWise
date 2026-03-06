import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles.css";
import { initData } from "@hydrowise/data";
import { appDataDir, join } from "@tauri-apps/api/path";
import { App } from "@/App";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element not found");
}

const bootstrap = async () => {
  const dataDir = await appDataDir();
  const desktopDbDir = await join(dataDir, "hydrowise-db");

  await initData({ platform: "desktop", desktopDbDir });

  createRoot(root).render(
    <StrictMode>
      <App />
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
