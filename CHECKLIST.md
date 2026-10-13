# KitTrack Audit Checklist

Tested on 2026-10-13 against the clean local production build at `http://127.0.0.1:3100` and the current Vercel deployment.

## Confirmed and working

- [x] `npm run build` passes.
- [x] `pnpm run lint` passes.
- [x] `pnpm run typecheck` passes.
- [x] `pnpm run test` passes: 3 tests.
- [x] Playwright passes: 4 browser tests, including all previously inactive controls.
- [x] Local routes serve: `/`, `/games`, `/games/game-titans`, `/jerseys`, `/roster`.
- [x] Vercel routes serve: `/`, `/games`, `/api/health/database`.
- [x] Local and production database health checks return `{ ok: true, service: "postgres", branch: "production" }`.
- [x] Mobile navigation drawer opens and exposes all four navigation links.
- [x] Game detail return action changes the issuance to returned and survives a browser reload.
- [x] Roster search filters to matching coaches.
- [x] Demo reset restores the initial state.
- [x] Create game opens a validated form, adds a scheduled game, writes it to local SQLite, and opens the new game.
- [x] Add member opens a validated form, adds an active player or coach, and persists it locally.
- [x] Register jersey opens a validated form, preserves repeated numbers across kit colours, and marks damaged/repair items unavailable.
- [x] Jersey search includes number, kit, size, and condition text.
- [x] Print return checklist invokes the browser print flow.
- [x] Copy plain text produces a readable return checklist in the clipboard.
- [x] Notifications reports outstanding issued jerseys and links to reconciliation.
- [x] The profile control opens a workspace menu on desktop.
- [x] Invalid game IDs return HTTP 404.
- [x] Malformed local storage no longer crashes hydration.
- [x] Local SQLite state is seeded from demo data and survives an API write/read round trip.

## P0 — Data and persistence

- [x] Use SQLite for local development and tests, with a file-backed database under the git-ignored `.data/` path.
- [x] Keep Neon/Postgres as the Vercel production adapter selected by runtime configuration; SQLite is development-only.
- [ ] Create a shared repository/service layer so pages do not know which database driver is active.
- [ ] Generate and apply migrations for SQLite and Neon from the same domain model.
- [x] Seed a local development database with the demo team, roster, jerseys, games, and issuances.
- [ ] Replace the remaining browser fallback with the relational server source of truth for production.
- [ ] Add API routes for teams, members, jerseys, games, issuances, and return events.
- [ ] Add authentication and team ownership before enabling shared production data.

Neon inspection found no application tables on the `production` branch, so no database data was deleted or cleared.

## P0 — Remaining product work

- [ ] Add participant selection and conflict-free jersey assignment to the created-game flow.
- [ ] Add handover confirmation, lost/damaged return states, acknowledgement, and close-game behavior.
- [ ] Replace the current local JSON state adapter with relational tables and transactions for production.
- [ ] Add authentication and team ownership before enabling shared production data.

## P1 — Tested behavior gaps

- [ ] Add loading, empty, and server error states to the API-backed screens.
- [ ] Add automated tests for every primary action and each API route.
- [ ] Add responsive browser coverage for narrow mobile layouts.

## P1 — Schema alignment

- [ ] Reconcile the Postgres schema with the domain types and demo data: game time is present in the UI data but absent from the schema, and issuance relationships differ between the schema and the demo model.
- [ ] Add migration files; `server/db/migrations` is currently empty.
- [ ] Move server-only environment access behind Nuxt runtime configuration; current code still falls back to `process.env` in server code.

## Cleanup decision

- [x] Interpreted “clear the database” as removing Neon from local development. The Neon production branch was inspected read-only and no remote data or schema was deleted.
