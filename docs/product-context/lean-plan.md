# Lean implementation plan

Status: Proposed operating plan  
Assumption: InsightsWall has effectively no active users and does not need gradual rollout or migration safety for meaningful production data yet.

This document supersedes the rollout- and scale-oriented implementation recommendations in `repository-audit.md`. The audit remains authoritative about current repository facts.

## Product bet

Build the smallest private workflow that answers one question:

> Is a Problem page connecting Evidence, a Decision, a Solution, and an Outcome useful enough that we return to it?

Everything that does not help answer that question is deferred.

## Keep

- Existing repository, authentication, Projects, memberships, Hono, React, PostgreSQL, Drizzle, and tests.
- Existing Project creation as Product creation for now; `projects.id` is the context boundary.
- New canonical tables rather than renaming Suggestions.
- Shared canonical object identity and typed links.
- Database-enforced same-Project links.
- Manual Evidence with visible source information.
- Structured Decisions with alternatives and supersession history.
- Activity events for meaningful mutations.
- Archive for canonical objects instead of destructive delete.
- Application commands/queries so business rules do not live in routes or components.
- One realistic fixture reused throughout development and tests.

## Remove from the first usable version

### Rollout machinery

- No API or web feature flags.
- No `product_context_enabled` Project column.
- No per-Product activation state.
- No cohort rollout or kill-switch matrix.

Isolation comes from the development branch, private authenticated routes, and adding navigation only when the slice is coherent.

### Premature infrastructure

- No outbox table, worker, queue, retry system, or separate process.
- No PostgreSQL CI service unless PGlite demonstrably cannot test a used feature.
- No full-stack browser environment initially; use PGlite API integration tests and existing mocked Playwright patterns.
- No dependency-injection framework or standalone transaction-manager abstraction.
- No schema file per table; use one cohesive Product Context schema file until it becomes difficult to navigate.

### Premature scale and retrieval

- No `tsvector`, GIN index, ranking, embeddings, or denormalized search document.
- Search uses a simple Project-scoped case-insensitive match over canonical titles and summaries.
- Upgrade search only after real data demonstrates a relevance or latency problem.

### Premature domain breadth

- No Workspace model.
- No new roles or permission editor.
- No Problem merge in the first usable slice.
- No Today or Review placeholder screens.
- No comments, notifications, attachments, Releases, Principles, or Constraints.
- No Source Artifacts, imports, candidates, AI, integrations, public Product Context, or MCP.

## Accepted limitations

| Limitation                                               | Why it is acceptable now                                      | Revisit trigger                                                     |
| -------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------- |
| UI may still say Project in shared legacy surfaces       | Avoid a risky rename before validating the new workflow       | Product Context becomes the primary product                         |
| Project members read; `ADMIN` writes canonical context   | Current role model already exists and creators are admins     | A real collaborator needs editing without administration            |
| Search is simple substring matching                      | Expected dataset is tiny                                      | Search becomes slow or users cannot find known objects              |
| PGlite is the primary database test                      | Current suite already uses it effectively                     | A PostgreSQL feature behaves differently in practice                |
| Browser tests may mock API responses                     | Faster and consistent with current frontend tests             | The vertical slice stabilizes or auth integration breaks repeatedly |
| Activity is synchronous                                  | No asynchronous side effects exist                            | Notifications/imports require durable processing                    |
| General object versions are used primarily for Decisions | Decision rationale history is the immediate trust requirement | Other object histories become a real user need                      |
| Existing public Suggestion/roadmap routes remain         | No need to migrate or remove them to test private context     | Product direction is validated and cutover is planned               |

## Minimal schema

One new `product-context-schema.ts` contains:

```text
product_objects
problems
evidence
decisions
decision_alternatives
solutions
outcomes
object_links
product_object_versions
activity_events
```

Use `project_id` physically and `productId` only where new Product Context APIs/UI benefit from that vocabulary. User references remain `text`.

Required database protection:

- foreign keys and useful Project/object indexes;
- composite foreign keys preventing cross-Project links;
- active-link uniqueness;
- archive timestamps;
- Decision alternative ordering;
- no cascading deletion of canonical history from normal application flows.

Kind/detail consistency may use straightforward composite keys/checks if Drizzle and PGlite support them cleanly. Do not add custom triggers solely to perfect an invariant that application commands and integration tests can safely enforce at this stage.

## Minimal authorization

```text
Unauthenticated: no Product Context access
Project non-member: no Product Context access
Project member with USER: read only
Project member with ADMIN: read and write
```

Checks occur inside commands/queries. Routes still require authentication, but middleware is not the only authorization boundary.

## Minimal UI

- Reuse existing Project creation/listing.
- Add one authenticated Product Context entry from a member's Project workflow.
- Add navigation only as features become real: Problems, Evidence, Decisions, Solutions, Search.
- The Problem detail page is the primary surface.
- Do not build an abstract graph visualization.

## Delivery phases

1. **Core Product Context:** additive schema, authorization, the complete canonical chain, activity, and integration tests.
2. **Usable experience:** complete Problem context, basic search, correction/archive behavior, navigation, empty/error states, accessibility, and lightweight onboarding.
3. **MVP release and validation:** production-like migration/security/data-safety checks, private deployment, and real usage leading to a Continue/Narrow/Revise/Stop decision.

After every step inside a phase, stop and reassess. Later phases are not commitments until the preceding exit criteria pass.

## Success condition

The first version succeeds when one real Problem page is useful enough to revisit when discussing or changing a product decision. Technical completeness without that behavior is not success.
