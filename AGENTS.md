# KitTrack agent instructions

Read `.agent/PROJECT.md` first, then the relevant workflow in `.agent/workflows/`. The hard stops in `.agent/rules/checkpoints.md` override general guidance.

Keep the MVP focused on team-owned physical jersey accountability: inventory, game participation, assignment, handover, collection, reconciliation, and history.

## Delegation

When subagents are available, delegate bounded work and request summaries with file references and command results:

- Before a non-trivial change: spawn `planner`.
- After implementation: spawn `tester`, then `reviewer`.
- Without subagents, work through the same roles in order and read each role document.
