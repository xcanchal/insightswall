# Phase 3 Step 01 — Release readiness

Status: Blocked by Phase 2  
Owner: Unassigned

## Outcome

The Product Context release candidate can be deployed privately without an obvious risk of unauthorized access, schema failure, silent data loss, or breaking the existing application.

## Read

- All Phase 1/2 handoffs and known limitations
- Current CI, deployment, environment examples, Better Auth, migrations, and database provider behavior
- Repository audit risk list, filtered to implemented scope

## Scope

- Rehearse migrations from the current legacy schema on production-like PostgreSQL or the actual non-critical deployment database.
- Verify empty-database setup and document the applied migration state.
- Test unauthenticated, non-member, `USER`, and `ADMIN` access across each command/query family.
- Test URL/object Project mismatch and cross-Project links.
- Confirm the database backup mechanism and a practical recovery path; perform a safe restore rehearsal when feasible.
- Run format, lint, typecheck, builds, API tests, browser tests, and a manual production-like smoke flow.
- Reconcile schema, routes, environment variables, and user-facing limitations with documentation.

## Do not add

New observability vendors, feature flags, deployment platforms, queue infrastructure, load testing, multi-region concerns, or exhaustive compliance work.

## Acceptance

- [ ] Migrations succeed without manual database editing.
- [ ] Authorization matrix and Project isolation pass server-side.
- [ ] Backup ownership, schedule, and recovery steps are known.
- [ ] Complete golden-path smoke test passes in the release environment.
- [ ] Legacy auth/Project/Suggestion/roadmap regressions pass.
- [ ] Critical errors are recoverable and do not leave partial state.
- [ ] Documentation reflects actual deployment and known limitations.

## Release decision

If all checks pass, deploy privately and begin Step 02. Otherwise fix only release blockers and repeat the failed evidence.
