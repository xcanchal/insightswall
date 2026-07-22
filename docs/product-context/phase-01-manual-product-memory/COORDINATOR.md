# Phase 1 coordinator

## Mission

Deliver the canonical chain without adding rollout, migration, scale, or product-polish work prematurely.

## Read

1. [`../lean-plan.md`](../lean-plan.md)
2. This phase README and [`STATUS.md`](./STATUS.md)
3. The three shared files
4. The single active step packet
5. The active agent's handoff

Read the full audit only when resolving a repository fact or known risk.

## Before and after each step

- Confirm dependencies and shared decisions.
- Assign one owner and mark the step `In progress`.
- Review code, authorization, provenance, history, and test evidence.
- Remove unused fields or abstractions before unblocking the next step.
- Record implementation facts needed by Phase 2.

## Reject by default

- Feature flags, activation state, workspaces, new roles, workers, outbox, queues, integrations, full-text/vector search, placeholder screens, legacy migration, and unnecessary parallel work.

## Completion

Phase 1 is complete when the full fixture chain works and the server-side trust invariants pass. Do not call it a releasable MVP yet; hand it to the Phase 2 coordinator for usability and correction workflows.
