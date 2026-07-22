# Phase 1 — Core Product Context

Status: In progress

## Goal

Implement the complete canonical chain and its server-side invariants. At the end of this phase, the product is a functional internal alpha—not yet the MVP release.

## Steps

| Step                                                    | State       | Result                                                             |
| ------------------------------------------------------- | ----------- | ------------------------------------------------------------------ |
| [01 Foundation](./steps/01-foundation.md)               | Complete    | Minimal schema, repository, authorization, and invariant tests     |
| [02 Problem + Evidence](./steps/02-problem-evidence.md) | Ready       | Create, link, and view an evidence-backed Problem                  |
| [03 Decision](./steps/03-decision.md)                   | Blocked     | Capture rationale, alternatives, context, and supersession history |
| [04 Solution + Outcome](./steps/04-solution-outcome.md) | Blocked     | Complete the reason-to-result chain                                |

Only one step is active by default. The coordinator may split a step only after documenting an independent boundary and file ownership.

## Shared context

- [`shared/decisions.md`](./shared/decisions.md)
- [`shared/domain-contract.md`](./shared/domain-contract.md)
- [`shared/demo-fixture.md`](./shared/demo-fixture.md)

## Exit criteria

- The fixture chain can be created through supported application/API paths.
- Product Context reads require Project membership and writes require `ADMIN`.
- Same-Project links, Evidence provenance, Decision versions, activity, and atomic mutations work.
- Basic UI exists for the golden path, even if it is not yet polished.
- Legacy Suggestions and roadmap remain operational.
- Focused and repository regression checks pass.

Phase 2 turns this functional alpha into a coherent, correctable product experience.
