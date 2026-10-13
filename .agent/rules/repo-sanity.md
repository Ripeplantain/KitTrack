# Repo sanity

Add as little as correctness allows. Search before creating files, utilities, components, types, or dependencies.

## Look here first

| Before adding                     | Check                     |
| --------------------------------- | ------------------------- |
| Nuxt pages and components         | `app/`                    |
| Server routes and domain services | `server/` once created    |
| Database schema and migrations    | `server/db/` once created |
| Tests and fixtures                | `tests/` once created     |
| Static assets                     | `public/`                 |

## Do not add

- Duplicate utilities, components, or domain logic.
- Speculative abstractions or dependencies.
- Temporary scripts, scratch files, or unrequested documentation.
- Unrelated formatting changes or refactors.

## Never edit or commit

`.nuxt/`, `.nitro/`, `.output/`, `dist/`, `node_modules/`, `.env`, and other local secret files.

Before finishing, read the full diff and confirm every changed line belongs to the task.
