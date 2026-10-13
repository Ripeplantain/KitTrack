# Checkpoints

Stop and ask before any of these. State the exact command or file change and why.

## Always

- `git commit`, `git push`, merge, rebase, pull, or opening/updating a pull request.
- Installing, removing, or upgrading dependencies, or editing `pnpm-lock.yaml`.
- Any schema or data command, including future `pnpm db:migrate`, `pnpm db:push`, or seed commands.
- Reading, printing, or editing real env or secret files. `.env.example` is allowed; `.env` is not.
- Deploying to Vercel or editing deployment/CI configuration.
- Any operation against shared, staging, production, or external team data.
- Deleting files not created in the current task or overwriting data.

## Never

- Add attribution trailers such as `Co-Authored-By` or `Generated with`.
- Create parallel copies such as `*-v2`, `*-new`, or `copy of`.
- Leave debug output, secrets, or generated build output tracked.

## Domain invariants

- Preserve physical jersey identity separately from visible jersey number.
- Keep inventory and issuance state changes transactional.
- Preserve historical accountability and audited corrections.
