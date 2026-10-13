# Feature workflow

L0–L1: change, check, self-review — no plan.  
L2: brief plan, tests, separate review pass.  
L3–L4: written plan agreed first, independent review; auth, schema, issuance, and collection work is L3 or above.

1. **planner:** define behavior, files, acceptance checks, and checkpoints. Use `feature/<short-slug>` from `main`.
2. **implementer:** make the smallest change; run `pnpm run build` and any available `TBD` checks after they are added.
3. **tester:** add focused unit/integration or Playwright tests and report exact results.
4. **reviewer:** inspect the full diff against the PRD and invariants.
5. **main agent stops:** report changes, verification, unverified items, and suggested commit. Commit is a checkpoint.

Done means the requested behavior works, tests and available verification pass, no secrets or generated output are tracked, and follow-ups are explicit.
