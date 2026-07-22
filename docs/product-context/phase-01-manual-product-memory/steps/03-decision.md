# Step 03 — Decision rationale and history

Status: Blocked by Step 02  
Owner: Unassigned

## Outcome

An admin records a Decision with rationale and ordered alternatives, connects it to the Problem and supporting Evidence, and can supersede it without erasing the previous rationale.

## Read

- Phase shared decisions, domain contract, and fixture
- Step 02 handoff and current Problem page/API contract
- Existing form/dialog/list components

## Scope

- Implement `CreateDecision`, minimal Decision read/list, and `SupersedeDecision`.
- Persist alternatives in stable order.
- Create `PROBLEM --LED_TO--> DECISION` and optional `EVIDENCE --SUPPORTS--> DECISION` links.
- Write Decision versions and activity atomically.
- Add member reads/admin writes to the API.
- Add Decision capture and display to the Problem workflow, including alternatives and superseded rationale.
- Add lifecycle, authorization, link, version, rollback, API, and mocked UI tests.

## Explicitly do not add

- Review reminders, owner assignment UI, complex lifecycle controls, general version UI for other objects, approval workflows, candidate Decisions, or notifications.

## Invariants

- Rationale and alternatives are preserved in versions.
- A replacement Decision points to the previous Decision using the accepted `SUPERSEDES` direction.
- Both Decisions remain readable.
- Context links are same-Project and validated through the generic link persistence path.
- Failed creation/supersession leaves no partial versions, links, or activity.

## Acceptance

- [ ] Fixture Decision and three alternatives appear on the Problem page.
- [ ] Problem and Evidence context is navigable.
- [ ] Supersession retains old and new rationale/status/history.
- [ ] Invalid lifecycle, Product mismatch, and permission attempts fail.
- [ ] Existing and Step 02 tests pass.

## Stop and use

Record one real product Decision. If rationale/alternatives feel burdensome, simplify fields before proceeding.
