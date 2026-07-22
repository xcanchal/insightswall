# Step 04 — Solution and observed Outcome

Status: Blocked by Step 03  
Owner: Unassigned

## Outcome

An admin records the response selected by a Decision and an observed qualitative or quantitative Outcome, completing the reason-to-result chain.

## Read

- Phase shared decisions, domain contract, and fixture
- Step 03 handoff and current Problem/Decision contracts

## Scope

- Implement `CreateSolution`, minimal Solution read/list, and `RecordOutcome`.
- Create `DECISION --SELECTS--> SOLUTION`, `SOLUTION --ADDRESSES--> PROBLEM`, and `SOLUTION --MEASURED_BY--> OUTCOME` links atomically with their user action.
- Support Outcome result, observed time, optional numeric value/unit, and optional source label/URL.
- Indicate shipped Solutions that have no Outcome.
- Extend the private API and Problem workflow.
- Add lifecycle, link, authorization, rollback, API, and mocked UI tests.

## Explicitly do not add

- Releases, task synchronization, roadmap migration, delivery planning, metrics integrations, experiments, or elaborate Solution boards.

## Invariants

- Solution and Outcome are context records, not execution-system replacements.
- Outcome describes an observation rather than a goal.
- All linked objects belong to the same Project.
- Mutations and activity are atomic.

## Acceptance

- [ ] Fixture Solution and 31% Outcome complete the chain.
- [ ] Missing-Outcome indication changes after recording an Outcome.
- [ ] Quantitative and qualitative Outcomes validate correctly.
- [ ] Non-member/`USER` writes and cross-Project links fail.
- [ ] Previous step and legacy tests pass.

## Stop and use

Complete a real chain if possible. If real work has no measurable Outcome yet, verify that “not measured” is still useful rather than forcing invented data.
