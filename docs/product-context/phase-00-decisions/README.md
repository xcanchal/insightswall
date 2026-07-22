# Phase 0 — Accept the lean defaults

Status: Complete

This is one short checkpoint, not an architecture phase.

## Goal

Accept or change the defaults in [`../lean-plan.md`](../lean-plan.md) before the first migration:

1. Existing Project is the Product Context boundary; no Workspace or duplicate Product table.
2. Existing Project creation/listing is reused.
3. Authenticated Project members read; `ADMIN` members write.
4. No feature flags or per-Project activation.
5. New canonical tables; Suggestions stay untouched.
6. No outbox, worker, full-text search infrastructure, new roles, merge, or placeholder screens.
7. Basic substring search is sufficient initially.
8. Problem, Decision, and Solution lifecycle values come from the existing domain document but only implemented transitions needed by the slice are exposed.
9. Evidence original content is preserved.
10. Decision supersession uses a typed link plus versions.

## Output

Update `phase-01-manual-product-memory/shared/decisions.md` to `Accepted` with any changed defaults and their consequences.

## Exit

When the human owner accepts that one file, Step 01 is ready. No ADR suite or additional readiness review is required.
