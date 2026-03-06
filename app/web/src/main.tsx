import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { App } from "./App.tsx";
import { queriesPromise } from "./data";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element not found");
}

queriesPromise
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
