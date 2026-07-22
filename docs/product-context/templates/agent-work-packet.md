# `<packet-id>` — `<bounded outcome>`

Status: Draft  
Owner: Unassigned

## Outcome

Describe one observable result. Avoid role descriptions such as “work on the backend.”

## Required context

- Active phase `README.md` and `COORDINATOR.md`
- Active feature `README.md`
- Exact shared contracts and ADRs needed
- Exact repository paths to inspect

## Depends on

List packet IDs or accepted decisions. Use `None` when independent.

## Scope

- Concrete behavior to implement
- Required persistence, command/query, API, UI, and test work

## Out of scope

- Explicit boundaries that prevent attractive but unrelated work

## Expected files

List likely owned paths or globs. The coordinator resolves overlap before starting.

## Invariants

- Domain, authorization, transaction, provenance, history, and archive rules that must remain true

## Acceptance criteria

- [ ] Observable criterion
- [ ] Error/permission criterion
- [ ] Test criterion

## Verification

List exact commands plus any focused manual or database checks.

## Handoff

Return the structure in [`agent-handoff.md`](./agent-handoff.md). Report contract deviations before suggesting follow-up work.
