---
version: agent-workflow 2.0.0 (2026-10-13)
size: small
shape: web-app, api, modular-monolith
roles: planner, implementer, tester, reviewer
---

# KitTrack

KitTrack is a mobile-first team jersey management application. It helps a captain track physical jerseys from inventory registration through game-day assignment, handover, return, loss, damage, and historical reconciliation.

## Stack

- Application: Nuxt 4.6.1 with Vue 3.5.43 and TypeScript.
- Package manager: pnpm 11.2.2; the repository has `pnpm-lock.yaml`.
- Database and ORM: Neon PostgreSQL with Drizzle ORM; schema and client scaffolded, migrations not run.
- Validation and auth: Zod installed; Better Auth installed, auth routes still to be wired.
- UI: Tailwind CSS v4, shadcn-nuxt metadata, Lucide icons, and mobile-first Vue pages.
- Deployment: Vercel.

## Commands

Taken from `package.json` and the approved PRD. Do not invent or run commands not listed here without asking.

| Purpose   | Command                                                           | Notes                               |
| --------- | ----------------------------------------------------------------- | ----------------------------------- |
| install   | `pnpm install`                                                    | checkpoint: changes lockfile        |
| dev       | `pnpm run dev`                                                    | local Nuxt development server       |
| typecheck | `pnpm run typecheck`                                              | Nuxt typecheck via vue-tsc          |
| lint      | `pnpm run lint`                                                   | ESLint flat config                  |
| test      | `pnpm run test`                                                   | Vitest unit/integration suite       |
| e2e       | `pnpm run e2e`                                                    | run after `pnpm run build`          |
| build     | `pnpm run build`                                                  | Nuxt production build               |
| db        | `pnpm run db:generate`, `pnpm run db:migrate`, `pnpm run db:push` | checkpoint: schema and data changes |

## Layout

- `app/`: Nuxt application source, layouts, pages, components, composables, demo data, types, and domain utilities.
- `public/`: static assets.
- `nuxt.config.ts`: Nuxt configuration.
- `package.json`: scripts and dependencies.
- `pnpm-lock.yaml`: dependency lockfile.
- `server/db/schema/`: Drizzle schema for teams, roster, jerseys, games, issuances, and audit events.
- `server/db/client.ts`: lazy Neon HTTP/Drizzle connection; requires `DATABASE_URL`.
- `tests/`: Vitest unit tests and Playwright browser tests under `tests/e2e/`.

## Invariants

- A physical jersey ID is distinct from its visible number; see PRD §3.2.
- Physical jersey status and issuance status must transition atomically; see PRD §7.3–7.4.
- A physical jersey cannot have overlapping active assignments or be issued while unavailable; see PRD §3.3 and §7.4.
- Historical games and jerseys with issuance records are never deleted; outstanding items remain accountable; see PRD §4.1 and §7.4.

## Branches and release

`main` is the base branch. Use `feature/<short-slug>`, `fix/<short-slug>`, or `chore/<short-slug>` for work branches. No release or hotfix train is defined yet.

## Specs

The source of truth is the user-provided KitTrack PRD, Version 1.1, October 2026. Read the relevant PRD section before planning domain, schema, or workflow changes. The planning checklist is maintained in the task outputs, not as a substitute for the PRD.
