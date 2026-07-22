# Product Context — lean execution index

Start every fresh session with [`START-HERE.md`](./START-HERE.md). The current assumption is that InsightsWall has effectively no active users, so the plan optimizes for learning and simplicity rather than rollout, migration, or scale.

For every fresh agent session, use [`START-HERE.md`](./START-HERE.md).

## Read order

1. [`lean-plan.md`](./lean-plan.md) — current scope and accepted limitations.
2. [`repository-audit.md`](./repository-audit.md) — repository facts; its rollout-grade recommendations are not all current.
3. [`phase-00-decisions/README.md`](./phase-00-decisions/README.md) — one short decision checkpoint.
4. [`phase-01-manual-product-memory/README.md`](./phase-01-manual-product-memory/README.md) — core canonical chain.
5. [`phase-02-usable-experience/README.md`](./phase-02-usable-experience/README.md) — usability, correction, activity, and search.
6. [`phase-03-mvp-release/README.md`](./phase-03-mvp-release/README.md) — release safety and private validation.
7. The single active step packet and exact source files it names.

## Execution model

- One coordinator maintains the small amount of shared context.
- One implementation agent owns the active end-to-end step.
- Do not parallelize until a step has an obvious independent subtask and no shared-file conflict.
- Stop after every step and reassess whether the product is becoming useful.
- Later migration, AI, and integration phases are ideas in [`later.md`](./later.md), not a backlog.

## Current sequence

```text
Phase 0: accept or change the lean defaults
    ↓
Phase 1: Core Product Context
    ↓
Phase 2: Usable experience
    ↓
Phase 3: MVP release and validation
```

## Working rules

1. Build only the active step.
2. Tests ship with the behavior they cover.
3. Authorization is server-side even when there are no users.
4. Preserve provenance and Decision history; those are the trust foundations.
5. Keep legacy Suggestions and roadmap untouched.
6. Do not add infrastructure for hypothetical traffic or future integrations.
7. Generated files are changed only through their generators.

## What counts as the MVP

Phase 1 alone is an internal functional alpha. Phase 2 produces an MVP release candidate. Phase 3 makes it releasable, deploys it privately, and determines whether it is valuable.

## Templates

- [Agent work packet](./templates/agent-work-packet.md)
- [Agent handoff](./templates/agent-handoff.md)
