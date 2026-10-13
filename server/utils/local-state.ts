import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import Database from "better-sqlite3";
import { demoState } from "~/data/demo";
import type { KitTrackState } from "~/types/kittrack";

function cloneState(state: KitTrackState): KitTrackState {
  return JSON.parse(JSON.stringify(state)) as KitTrackState;
}

function openDatabase(databasePath: string) {
  const absolutePath = resolve(process.cwd(), databasePath);
  mkdirSync(dirname(absolutePath), { recursive: true });
  const database = new Database(absolutePath);
  database.exec(`
    CREATE TABLE IF NOT EXISTS kittrack_state (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      state TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);
  return database;
}

export function readLocalState(databasePath: string): KitTrackState {
  const database = openDatabase(databasePath);
  const row = database
    .prepare("SELECT state FROM kittrack_state WHERE id = 1")
    .get() as { state: string } | undefined;
  if (!row) {
    const seeded = cloneState(demoState);
    database
      .prepare(
        "INSERT INTO kittrack_state (id, state, updated_at) VALUES (1, ?, ?)",
      )
      .run(JSON.stringify(seeded), new Date().toISOString());
    database.close();
    return seeded;
  }
  const state = JSON.parse(row.state) as KitTrackState;
  database.close();
  return state;
}

export function writeLocalState(databasePath: string, state: KitTrackState) {
  const database = openDatabase(databasePath);
  database
    .prepare(
      "INSERT INTO kittrack_state (id, state, updated_at) VALUES (1, ?, ?) ON CONFLICT(id) DO UPDATE SET state = excluded.state, updated_at = excluded.updated_at",
    )
    .run(JSON.stringify(state), new Date().toISOString());
  database.close();
  return state;
}
