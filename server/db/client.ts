import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { schema } from "./schema";

export function getDatabase() {
  const config = useRuntimeConfig();
  const databaseUrl = config.databaseUrl || process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw createError({
      statusCode: 503,
      statusMessage: "Database is not configured",
    });
  }

  return drizzle(neon(databaseUrl), { schema });
}
