# Testing

## Planned test system

| Kind                 | Tool       | Location and naming         | Command                               |
| -------------------- | ---------- | --------------------------- | ------------------------------------- |
| Unit and integration | Vitest     | `tests/` and `**/*.test.ts` | `pnpm run test`                       |
| Browser workflow     | Playwright | `tests/e2e/`                | `pnpm run e2e` after `pnpm run build` |

The PRD requires tests for the jersey state machine, assignment conflicts, collection, late returns, lost/damaged handling, and the captain's end-to-end game-day workflow.

## Expectations

- Add a regression test for every bug fix.
- Test public behavior and domain transitions, not implementation details.
- Cover the physical-jersey and issuance invariants in `.agent/PROJECT.md`.
- Run the narrowest relevant check first, then the full available suite.

## Do not

- Weaken, skip, or delete tests to make a change pass.
- Add tests that assert nothing meaningful.
- Introduce another test framework or mocking approach.
- Run tests against shared or production data.
