# Start here — fresh Product Context session

Use this file as the stable entry point for every fresh agent session. It explains how to find current state without duplicating it here.

## Prompt to give a fresh coordinator

```text
Read AGENTS.md and docs/product-context/START-HERE.md.
Act as the Product Context coordinator.
Find the next Ready step from the phase status files and complete exactly that step.
Run its verification, update coordinator-owned status, and return the standard handoff.
Do not begin the following step.
```

## Session checklist

### 1. Establish repository state

- [ ] Read root `AGENTS.md` completely.
- [ ] Run `git status --short`; preserve unrelated user changes.
- [ ] Read [`lean-plan.md`](./lean-plan.md).
- [ ] Read [`README.md`](./README.md) for the phase map.

### 2. Find the active work

First check [`phase-00-decisions/agents/agent-01-lock-lean-decisions.md`](./phase-00-decisions/agents/agent-01-lock-lean-decisions.md). If it is not `Complete`, resolve that human decision checkpoint before selecting implementation work.

Then check phase status in order:

1. [`phase-01-manual-product-memory/STATUS.md`](./phase-01-manual-product-memory/STATUS.md)
2. [`phase-02-usable-experience/STATUS.md`](./phase-02-usable-experience/STATUS.md)
3. [`phase-03-mvp-release/STATUS.md`](./phase-03-mvp-release/STATUS.md)

Select the first `Ready` step. If a preceding step is `In progress`, resume that step instead. Never skip a `Blocked` dependency.

If no implementation step is Ready, inspect the applicable decision/checkpoint document and report the exact blocker rather than choosing work from `later.md`.

### 3. Load only the active context

- [ ] Read the active phase `README.md` and `COORDINATOR.md`.
- [ ] For Phase 1, read [`shared/decisions.md`](./phase-01-manual-product-memory/shared/decisions.md) and [`shared/domain-contract.md`](./phase-01-manual-product-memory/shared/domain-contract.md).
- [ ] Read exactly one active step packet completely.
- [ ] Inspect only the repository files needed by that packet.
- [ ] Consult [`repository-audit.md`](./repository-audit.md) only for a repository fact or risk referenced by the step.

### 4. Execute one step

- [ ] Mark the step `In progress` if the coordinator has not already done so.
- [ ] Implement only its Scope and Acceptance sections.
- [ ] Respect every “Do not add” or “Explicitly do not add” boundary.
- [ ] Add focused tests with the behavior.
- [ ] Preserve legacy routes and unrelated user changes.
- [ ] Do not begin the next step, even if it is now unblocked.

### 5. Verify and hand off

- [ ] Run the step-specific checks.
- [ ] Run proportionate repository format, lint, typecheck, build, and regression checks.
- [ ] Re-read the acceptance checklist against actual behavior.
- [ ] Update the phase `STATUS.md` only from evidence.
- [ ] Update the step status and owner.
- [ ] Return the structure in [`templates/agent-handoff.md`](./templates/agent-handoff.md).
- [ ] List the next newly Ready step without starting it.

## State ownership

| State                         | Source of truth                     | Writer                            |
| ----------------------------- | ----------------------------------- | --------------------------------- |
| Product/architecture defaults | Phase 1 `shared/decisions.md`       | Human owner + coordinator         |
| Domain contract               | Phase 1 `shared/domain-contract.md` | Coordinator after accepted change |
| Current progress              | Active phase `STATUS.md`            | Coordinator                       |
| Task scope                    | Active step packet                  | Coordinator before execution      |
| Implementation truth          | Code, migrations, and tests         | Implementing agent                |
| Deferred ideas                | [`later.md`](./later.md)            | Human owner + coordinator         |

## Stop conditions

Stop and report instead of guessing when:

- an accepted decision must change;
- a migration would alter or delete legacy data unexpectedly;
- authorization semantics are unclear;
- completing the step requires deferred infrastructure or a new external dependency;
- existing user changes overlap the required files;
- verification cannot distinguish an implementation failure from a baseline failure.
