import { createWebClient, type DbClient } from "@hydrowise/database";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { getConfig } from "./config";
import { createChapterRoutes } from "./routes/chapter";
import { createChatRoutes } from "./routes/chat";
import { createCourseRoutes } from "./routes/course";
import { createDocumentRoutes } from "./routes/document";
import { createRagRoutes } from "./routes/rag";
import { createTopicRoutes } from "./routes/topic";

const app = new Hono();

const config = getConfig();

if (!config.databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

console.log(`Starting in ${config.mode.toUpperCase()} mode`);
// Always use Web Client (Postgres) for now, even in desktop mode
const db: DbClient = createWebClient(config.databaseUrl);

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
app.route("/rag", createRagRoutes(db));
app.route("/course", createCourseRoutes(db));
app.route("/chapter", createChapterRoutes(db));
app.route("/topic", createTopicRoutes(db));

export default app;
