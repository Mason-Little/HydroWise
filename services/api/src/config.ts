export const getConfig = (runtimeEnv: NodeJS.ProcessEnv = process.env) => {
  return {
    mode: (runtimeEnv.RUNTIME_MODE as "web" | "desktop") || "web",
    databaseUrl: runtimeEnv.DATABASE_URL,
    desktopDbPath: runtimeEnv.DESKTOP_DB_PATH || "./hydrowise.db",
  };
};
