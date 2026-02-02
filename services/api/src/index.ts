import { createWebClient } from "@hydrowise/database";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { createChatRoutes } from "./chat";
import { createDocumentRoutes } from "./document";

const app = new Hono();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const db = createWebClient(databaseUrl);

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "userId"],
  }),
);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/chat", createChatRoutes(db));
app.route("/document", createDocumentRoutes(db));

export default app;
