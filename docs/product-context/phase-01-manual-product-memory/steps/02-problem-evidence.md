# Step 02 — Problem plus manual Evidence

Status: Blocked by Step 01  
Owner: Unassigned

## Outcome

An admin of an existing Project creates a Problem, adds manual Evidence with visible provenance, links it to the Problem, and sees it on a basic private Problem page.

## Read

- Phase shared decisions, domain contract, and fixture
- Step 01 handoff
- Current Hono route/use-case patterns, Project member authorization, React Query hooks, forms, and Project routing

## Scope

- Implement `CreateProblem`, `ListProblems`, `CreateEvidence`, and `LinkEvidenceToProblem`.
- Write object/detail/activity and link changes atomically.
- Add authenticated, member-scoped read routes and admin-scoped write routes.
- Add a private Product Context entry for an existing member Project.
- Add Problems list/create, manual Evidence form, linking action, and a basic Problem detail page showing linked Evidence.
- Add lifecycle, provenance, authorization, rollback, API integration, and mocked UI tests.

## Likely files

```text
apps/api/src/modules/product-context/application/*
apps/api/src/modules/product-context/presentation/*
apps/api/src/server.ts
apps/api/test/integration/product-context-problems.test.ts
apps/web/src/api/product-context.ts
apps/web/src/hooks/use-product-context.ts
apps/web/src/routes/products/*
apps/web/test/e2e/product-context-problem.spec.ts
```

## Explicitly do not add

- Separate Product creation, new roles, broad navigation, Today/Review, edit/merge workflows, Suggestion import, comments, notifications, or advanced visual design.

## Invariants

- Read requires Project membership; write requires `ADMIN`.
- Evidence original content and source information round-trip unchanged.
- Link direction is `EVIDENCE --SUPPORTS--> PROBLEM`.
- Every mutation writes activity in the same transaction.
- Archived objects are excluded from default reads even if archive UI is not built yet.

## Acceptance

- [ ] The fixture Problem and three Evidence items can be created and linked.
- [ ] A member can read; a non-member cannot read; `USER` cannot write; `ADMIN` can write.
- [ ] Invalid/cross-Project/duplicate links fail safely.
- [ ] The page shows source information and useful empty/error states.
- [ ] Existing Suggestions and roadmap behavior/tests remain unchanged.

## Stop and use

Enter one real Problem and at least one real Evidence item. Note whether creation feels too heavy before adding Decisions.
