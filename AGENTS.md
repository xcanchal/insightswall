# InsightsWall agent protocol

## Product Context execution

1. Read `docs/product-context/START-HERE.md` and follow its session checklist.
2. Complete one Ready step at a time. Do not begin the next step unless the user explicitly requests it.
3. The coordinator owns phase status and shared decision changes.
4. Return handoffs using `docs/product-context/templates/agent-handoff.md`.

## Scope constraints

- Preserve existing authentication, Project, Suggestion, roadmap, and public-route behavior unless the active step explicitly changes it.
- Product Context uses existing Project identity; no Workspace or duplicate Product table.
- Product Context reads require Project membership; writes require Project `ADMIN`.
- Do not add feature flags, activation columns, new roles, outbox/workers, queues, integrations, AI, embeddings, full-text search infrastructure, or placeholder screens unless a later accepted step explicitly requires them.
- Keep business rules in reusable commands/queries or domain/application services, not route handlers or React components.
- Preserve Evidence original content, Decision history, activity, Project isolation, and transactional atomicity.
- Use existing repository conventions and the simplest implementation serving the active acceptance criteria.

## Implementation discipline

- Inspect existing code and user changes before editing.
- Use Drizzle generation for migrations/snapshots and TanStack generation for route trees; never hand-edit generated metadata.
- Add focused tests with each behavior and run the active packet's checks plus proportionate repository regressions.
- Do not edit later-phase plans to make an implementation appear complete. Report deviations in the handoff.
