import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles.css";
import { initData } from "@hydrowise/data";
import { App } from "@/App";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element not found");
}

initData({ platform: "web" })
  .then(() => {
    createRoot(root).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  })
  .catch((err) => {
    root.innerHTML = `
      <div style="padding: 2rem; font-family: system-ui; color: #c00;">
        <h1>Failed to initialize</h1>
        <pre>${String(err?.message ?? err)}</pre>
      </div>
    `;
  });
