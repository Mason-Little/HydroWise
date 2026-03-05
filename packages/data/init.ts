import { createDbForPlatform } from "./platform";
import { makeQueries } from "./queries/makeQueries";

export type Queries = ReturnType<typeof makeQueries>;

const state: { promise: Promise<Queries> | null } = { promise: null };

/**
 * Initialize data layer once; returns the query API.
 * Safe to call multiple times (e.g. React StrictMode).
 */
export function initData(opts: {
  platform: "web" | "desktop";
  desktopDbDir?: string;
}): Promise<Queries> {
  if (!state.promise) {
    state.promise = createDbForPlatform(opts).then((db) => makeQueries(db));
  }
  return state.promise;
}

/**
 * Returns the already-initialized queries, or throws if initData was never called.
 */
export async function getQueries(): Promise<Queries> {
  if (!state.promise) {
    throw new Error(
      "@hydrowise/data not initialized. Call initData({ platform: ... }) during bootstrap."
    );
  }
  return state.promise;
}
