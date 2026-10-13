# Fix workflow

Use `fix/<short-slug>` from `main`.

1. **main agent or planner:** reproduce the issue with the smallest reliable case and trace symptom to cause.
2. **tester:** add a failing regression test that captures the real failure.
3. **implementer:** make the smallest fix; do not refactor on the way.
4. **reviewer:** check the fix, regression test, sibling paths, and jersey accountability invariants.
5. Stop at the commit checkpoint and report cause, evidence, verification, and residual risk.

Do not weaken tests, erase historical records, or bypass transactional state checks to make a failure disappear.
