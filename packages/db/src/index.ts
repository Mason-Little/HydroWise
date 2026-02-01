import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { PgliteDatabase } from "drizzle-orm/pglite";
import type * as schema from "./schema";

export {
  and,
  asc,
  cosineDistance,
  desc,
  eq,
  gt,
  gte,
  hammingDistance,
  ilike,
  inArray,
  innerProduct,
  jaccardDistance,
  l1Distance,
  l2Distance,
  lt,
  lte,
  ne,
  or,
  sql,
} from "drizzle-orm";
export { createDesktopClient } from "./desktop";
export * from "./schema";
export { createWebClient } from "./web";
export type WebDbClient = NodePgDatabase<typeof schema>;
export type LocalDbClient = PgliteDatabase<typeof schema>;
export type DbClient = WebDbClient | LocalDbClient;
