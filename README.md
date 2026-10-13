# KitTrack

Mobile-first team jersey management and collection for captains and kit managers.

KitTrack tracks the physical jersey—not only the visible number—from inventory registration through game-day assignment, handover, collection, late return, loss, damage, and reconciliation.

## Stack

- Nuxt 4 + Vue 3 + TypeScript
- Tailwind CSS v4 + shadcn-nuxt foundation
- Neon PostgreSQL + Drizzle ORM
- Better Auth + Zod foundation
- Vitest + Playwright
- Vercel deployment target

## Setup

```bash
pnpm install
neon init -y --org-id <org-id> --project-id <project-id> --branch production --services postgres
neon deploy
pnpm run dev
```

`neon deploy` writes the pooled `DATABASE_URL`, direct `DATABASE_URL_UNPOOLED`, and `NEON_BRANCH` values to `.env.local`. The Nuxt server uses the pooled URL for application queries, while Drizzle uses the direct URL for migrations. Never commit `.env.local`.

The server-only `GET /api/health/database` endpoint runs `select 1` through Drizzle and reports the active Neon branch.

## Verification

```bash
pnpm run format
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run e2e
```

Run `pnpm run build` before `pnpm run e2e`; the browser suite starts the generated Nitro server.

## Database commands

```bash
pnpm run db:generate
pnpm run db:migrate
pnpm run db:push
```

Database commands are checkpointed. Review the migration plan and approve the exact command before running against any shared or production database.

## Current MVP slice

The current vertical slice includes a responsive captain dashboard, game list, game reconciliation page, jersey inventory, roster view, browser-local demo persistence, return actions, and domain tests. The Neon connection and health probe are wired; domain persistence and authenticated multi-user access remain the next integration step. The Drizzle schema is ready but has not been pushed to the shared production branch.
