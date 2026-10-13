import { readLocalState } from "../utils/local-state";

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);
  if (config.databaseDriver !== "sqlite") {
    throw createError({
      statusCode: 501,
      statusMessage: "Local SQLite state is only enabled in development",
    });
  }
  return readLocalState(config.sqlitePath);
});
