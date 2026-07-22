# Phase 2 Step 01 — Context, activity, and basic search

Status: Blocked by Phase 1  
Owner: Unassigned

## Outcome

One responsive Problem page presents the complete chain and stored activity, while simple private search reaches canonical objects directly.

## Read

- Phase 1 completion handoffs and shared fixture
- Minimal domain contract
- `docs/04-UX-AND-UI.md` sections 4 and 7 for information hierarchy
- Existing suggestion search for URL/debounce interaction only

## Scope

- Complete `GetProblemContext` with Evidence, Decisions/alternatives/supersession, Solutions, Outcomes, and activity.
- Present those as clear sections with direct navigation and meaningful empty states.
- Add Project-scoped case-insensitive search over object title/summary.
- Add a small Search screen with direct links and optional cheap kind filtering.
- Audit command-to-activity coverage and fill gaps.
- Add API integration and mocked browser tests.

## Do not add

Full-text ranking/indexes, embeddings, semantic answers, graph visualization, global search, dashboards, Today, or Review.

## Acceptance

- [ ] Complete and partial fixture Problems render correctly without duplicate or cross-Project nodes.
- [ ] Evidence provenance and Decision rationale/history are prominent.
- [ ] Activity reflects stored events in chronological order.
- [ ] Known titles/summaries are searchable and navigate correctly.
- [ ] Archived/unauthorized context is excluded.
- [ ] Responsive and accessibility checks pass proportionately.
