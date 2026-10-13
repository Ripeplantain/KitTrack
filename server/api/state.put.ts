import { z } from "zod";
import { writeLocalState } from "../utils/local-state";

const stateSchema = z.object({
  teamName: z.string(),
  members: z.array(z.unknown()),
  jerseys: z.array(z.unknown()),
  games: z.array(z.unknown()),
  issuances: z.array(z.unknown()),
});

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  if (config.databaseDriver !== "sqlite") {
    throw createError({
      statusCode: 501,
      statusMessage: "Local SQLite state is only enabled in development",
    });
  }
  const parsed = stateSchema.safeParse(await readBody(event));
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid KitTrack state",
    });
  }
  return writeLocalState(config.sqlitePath, parsed.data as never);
});
