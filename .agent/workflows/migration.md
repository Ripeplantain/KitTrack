# Migration workflow

Database and schema work is always L3 or above. Use `feature/<short-slug>` from `main` unless the task is specifically a bug fix.

1. **planner:** define start state, end state, compatibility window, rollback, affected routes/services, and the exact checkpoint command.
2. **implementer:** update schema, migration, and application code in compatible steps; never edit an applied migration.
3. **tester:** run the migration on a realistic local dataset, verify before/after rows, and run the relevant tests. Shared or production data is prohibited.
4. **reviewer:** inspect ordering, locking, rollback, data-loss paths, and consistency between jersey and issuance states.
5. Stop before `pnpm run db:migrate`, `pnpm run db:push`, or seed commands are executed until the user approves the exact command.
