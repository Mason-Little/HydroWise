import type { createDb } from "../client/createDb";

export type Db = Awaited<ReturnType<typeof createDb>>;
