# Step 01 — Minimal canonical foundation

Status: Complete  
Owner: Codex

## Outcome

The database can store the complete manual context chain with same-Project links, Decision versions, activity, and archive state. A small repository/access foundation is ready for feature commands. Nothing is user-facing.

## Read

- [`../../lean-plan.md`](../../lean-plan.md)
- Phase shared decisions, domain contract, and fixture
- Repository audit sections 2, 3, 9, 10, and 11 for current facts
- Current Drizzle schema/migrations, Project membership repository, and PGlite helper

## Scope

- Add one `product-context-schema.ts` containing the ten tables in the lean plan.
- Add shared constants/types only when consumed by API and web.
- Enforce foreign keys, same-Project links, active-link uniqueness, archive columns, and useful indexes.
- Use Better Auth `text` IDs for actor/creator references.
- Add a minimal Product Context repository and Project membership access helper.
- Keep authorization callable from commands/queries rather than only middleware.
- Add migration and invariant integration tests.

## Likely files

```text
apps/api/src/lib/db/product-context-schema.ts
apps/api/src/lib/db/index.ts
apps/api/drizzle/*
apps/api/src/modules/product-context/domain/*
apps/api/src/modules/product-context/infrastructure/product-context.repository.ts
apps/api/src/modules/product-context/application/product-access.ts
apps/api/test/integration/product-context-schema.test.ts
packages/types/src/product-context.ts
```

## Explicitly do not add

- Feature flags, Project schema changes, workspaces, roles, outbox, worker, triggers, full-text search, routes, or UI.
- Product creation adapter; existing Project creation is sufficient.
- Problem merge or generalized comments/notifications.
- A transaction-manager or DI abstraction used by only one repository.

## Invariants

- Cross-Project link insertion fails.
- Duplicate active semantic links fail.
- Canonical writes can use a single Drizzle transaction.
- Project `USER` reads and `ADMIN` writes are representable by the access helper.
- Legacy schema/data is untouched.

## Acceptance

- [x] Migration applies from an empty database and after existing migration `0001`.
- [x] The complete fixture shape is representable.
- [x] Negative database invariant tests pass.
- [x] No existing route behavior changes.
- [x] API tests, typecheck, lint, and formatting pass.

## Stop and reassess

Before Step 02, inspect whether the schema contains anything unused by the fixture. Remove it rather than preserving hypothetical flexibility.
