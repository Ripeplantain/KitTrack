import { sql } from "drizzle-orm";
import { getDatabase } from "../../db/client";

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();

  try {
    const result = await getDatabase().execute<{ ok: number }>(
      sql`select 1 as ok`,
    );
    const row = result.rows[0];

    return {
      ok: Number(row?.ok) === 1,
      service: "postgres",
      branch: config.neonBranch || process.env.NEON_BRANCH || "unknown",
    };
  } catch {
    throw createError({
      statusCode: 503,
      statusMessage: "Database health check failed",
    });
  }
});
