import { sql } from "drizzle-orm";

export function cosineDistance() {
  return sql`embedding <-> $1`;
}
