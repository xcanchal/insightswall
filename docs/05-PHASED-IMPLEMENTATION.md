# Phased Implementation Plan

## 1. Delivery strategy

Build one complete human workflow before broad automation:

> Create a problem → attach evidence → record a decision → link a solution → record an outcome.

The product should be useful manually before integrations and AI are required.

Assumption: nights-and-weekends development by one experienced full-stack engineer, with occasional design or user-research support.

Estimated private-beta horizon: **12–16 weeks**, depending on how reusable the current InsightsWall platform is.

## 2. Phase overview

| Phase | Goal | Indicative duration |
|---|---|---:|
| 0 | Domain validation and technical audit | 1–2 weeks |
| 1 | Manual Product Memory vertical slice | 2–3 weeks |
| 2 | InsightsWall feedback migration | 2–3 weeks |
| 3 | Candidate intelligence and review queue | 3–4 weeks |
| 4 | First external integration | 2–4 weeks |
| 5 | Agent context API and MCP | 2–3 weeks |
| 6 | Proactive outcomes and intelligence | Later |

Durations are directional, not commitments.

## 3. Phase 0 — Domain validation and repository audit

### Goal

Confirm that the proposed model is understandable, useful, and compatible with the existing codebase.

### Product work

- Finalize MVP vocabulary:
  - Evidence
  - Problem
  - Decision
  - Solution
  - Outcome
- Create three realistic end-to-end product examples.
- Interview five product people.
- Test the problem-detail and decision-capture flows.
- Decide whether “Solution” is the right UI term.
- Decide whether Today or Problems is the default home.

### Engineering work

- Audit existing:
  - auth;
  - workspace/project schema;
  - membership and authorization;
  - comments;
  - notifications;
  - activity log;
  - attachment storage;
  - API/module boundaries;
  - worker or background-job support;
  - migration tooling;
  - search.
- Identify reusable code and dangerous coupling to suggestions/roadmaps.
- Produce an implementation delta.
- Define v2 feature flag and route strategy.

### Exit criteria

- Product people can explain the lifecycle without coaching.
- No unresolved naming issue blocks the schema.
- Repository audit identifies a credible reuse plan.
- The first vertical slice has a bounded backlog.

## 4. Phase 1 — Manual Product Memory

### Goal

Deliver a coherent product-context workspace without integrations or advanced AI.

### Epics

#### 4.1 Product graph foundation

Build:

- `product_objects`;
- typed detail tables;
- `object_links`;
- object history;
- archive and restore;
- application commands and queries.

Acceptance criteria:

- A product object cannot link across products.
- All object mutations produce activity events.
- Object kind and detail table remain consistent.
- Archived objects disappear from default lists but remain in history.

#### 4.2 Problems

Build:

- create/edit/archive;
- lifecycle state;
- owner;
- summary and impact;
- list and filters;
- detail page.

Acceptance criteria:

- A PM can create a problem in under two minutes.
- The problem page clearly separates evidence, decisions, solutions, and outcomes.
- Empty sections explain their purpose.

#### 4.3 Evidence

Build:

- manual evidence creation;
- paste text;
- source metadata;
- link/unlink to problem;
- evidence list;
- provenance display.

Acceptance criteria:

- Original content and annotations are distinguishable.
- Evidence may support multiple problems.
- Linking evidence updates the problem detail immediately.

#### 4.4 Decisions

Build:

- proposed/accepted/rejected/superseded;
- question, outcome, rationale, alternatives;
- owner and review date;
- decision register;
- link to problem and evidence.

Acceptance criteria:

- Accepting a decision creates an immutable history version.
- Superseding retains the previous decision.
- Due-for-review decisions are queryable.

#### 4.5 Solutions and outcomes

Build:

- solution lifecycle;
- problem and decision links;
- qualitative/quantitative outcome;
- shipped-without-outcome state.

Acceptance criteria:

- A shipped solution can be identified as missing an outcome.
- Outcomes show observation date and source.
- A full Evidence → Problem → Decision → Solution → Outcome chain is navigable.

#### 4.6 Search

Build:

- PostgreSQL full-text search;
- object-kind filters;
- direct object navigation.

Acceptance criteria:

- Search returns relevant object titles and summaries.
- Search results show type, status, and linked product.

### Phase 1 demo

```text
Problem:
Customers cannot organize large dashboard collections.

Evidence:
12 feedback items and 3 interviews.

Decision:
Use one-level collections rather than nested folders.

Solution:
Collections.

Outcome:
Support requests decreased 31%.
```

### Exit criteria

A PM can use the product for a real decision without any AI feature.

## 5. Phase 2 — Existing InsightsWall migration

### Goal

Turn current suggestions, votes, comments, and roadmap information into the first product-context dataset.

### Epics

#### 5.1 Import framework

- migration runs are idempotent;
- dry-run mode;
- progress and failure reporting;
- source identifiers retained;
- rollback strategy.

#### 5.2 Suggestions to evidence

Mapping:

```text
Suggestion → Evidence: Customer feedback
Suggestion author → Source author
Suggestion content → Original content
Suggestion status → Source metadata
Suggestion URL → Source URL
```

#### 5.3 Votes as signals

Do not create one evidence item per vote.

Store:

- vote count;
- voter/customer references where legally and technically available;
- time distribution;
- source metadata.

#### 5.4 Comments

Import as:

- discussion attached to evidence; or
- additional evidence when comments contain distinct customer context.

Start conservatively: retain as evidence discussion.

#### 5.5 Roadmap items

Map to Solution candidates.

- Planned → Planned solution
- In progress → In-progress solution
- Done → Shipped solution
- Rejected/closed suggestions remain evidence, not rejected problems.

#### 5.6 Migration review UI

Provide:

- imported item counts;
- unresolved records;
- duplicate detection;
- candidate problem generation trigger;
- migration audit log.

### Exit criteria

- Existing data is preserved and source-linked.
- No suggestion is automatically treated as a problem.
- Imported data can be used in the Phase 1 workflow.
- Migration can be rerun safely in staging.

## 6. Phase 3 — Intelligence candidates and review queue

### Goal

Make the product reduce work instead of creating documentation overhead.

### First intelligence use cases

Prioritize by reliability and clear review value.

1. Duplicate evidence
2. Evidence-to-existing-problem link
3. Candidate problem cluster
4. Decision extraction from pasted text
5. Missing outcome reminder
6. Contradiction candidate

Do not begin with autonomous prioritization.

### Epics

#### 6.1 Candidate framework

- candidate table;
- source citations;
- confidence;
- status;
- assignment;
- accept/edit/reject/snooze;
- audit history.

#### 6.2 Evidence similarity

- normalization;
- embeddings or model-assisted similarity;
- duplicate threshold;
- candidate grouping.

#### 6.3 Candidate problem generation

Input:

- selected or clustered evidence.

Output:

- proposed title;
- problem statement;
- affected segment hints;
- cited evidence;
- confidence;
- similar existing problems.

#### 6.4 Decision extraction

From pasted text initially.

Output:

- question;
- outcome;
- rationale;
- alternatives;
- consequences;
- linked evidence.

#### 6.5 Review queue

Views:

- assigned to me;
- emerging problems;
- candidate links;
- duplicates;
- decisions;
- hygiene.

#### 6.6 Quality telemetry

Track:

- accepted unchanged;
- edited then accepted;
- rejected;
- rejection reason;
- time to review;
- source count;
- model and prompt version.

### Exit criteria

- Candidate quality is measurable.
- At least one candidate type has >60% acceptance in internal usage.
- No LLM output can silently mutate canonical objects.
- Review actions take seconds, not minutes.

## 7. Phase 4 — First external integration

### Goal

Prove that context can converge from an existing work system.

### Recommended order

1. **GitHub** if the strongest wedge is agent/engineering context.
2. **Linear** if the strongest wedge is product planning.
3. **Slack** only after structured integrations, because it is noisy and permission-sensitive.

A practical first choice is GitHub read-only.

### GitHub v1 scope

Import:

- issues;
- pull requests;
- release references;
- repository metadata;
- labels;
- linked issue/PR relationships.

Support:

- manual link to product object;
- candidate PR-to-solution link;
- candidate issue-to-problem link;
- deep link back to GitHub.

Exclude:

- writing comments;
- changing issue status;
- repository-wide autonomous analysis;
- code indexing.

### Integration architecture

- OAuth/App installation;
- read-only permissions where possible;
- webhooks;
- periodic reconciliation;
- idempotent import;
- per-product repository selection;
- connection health UI.

### Exit criteria

- Imported artifacts appear with provenance.
- Disconnecting stops sync.
- Manual and suggested linking works.
- Integration failures are visible and recoverable.

## 8. Phase 5 — Agent context API and MCP

### Goal

Allow coding and operational agents to consume accepted product context and propose updates.

### REST first

Build stable application query:

```text
BuildAgentContext
```

Inputs:

- product;
- task text, external reference, or object;
- requested context kinds;
- depth and limit.

Outputs:

- summary;
- canonical nodes;
- links;
- sources;
- constraints;
- conflicts;
- staleness.

### MCP tools

Read:

```text
get_product_context
find_relevant_decisions
find_constraints
explain_solution
search_product_context
```

Write-as-candidate:

```text
propose_decision
propose_link
link_pull_request
record_outcome_candidate
```

### Security

- scoped API tokens;
- product-level permissions;
- read/write candidate distinction;
- audit actor type = agent;
- rate limits;
- context size limits.

### Exit criteria

- One coding-agent workflow uses Product Context before implementation.
- Agent writes never bypass review.
- Context bundles are deterministic enough to test.
- Sources are exposed in machine-readable form.

## 9. Phase 6 — Proactive intelligence

### Goal

Make Today a genuinely useful operational surface.

Candidate signals:

- problem mentions increasing;
- accepted decision contradicted by new evidence;
- decision review date due;
- shipped solution missing outcome;
- problem improving after release;
- duplicate solutions across teams;
- active solution with no linked problem;
- feature request cluster associated with important accounts.

Only introduce signals with clear evidence and an actionable review path.

## 10. Cross-cutting work

### Testing

#### Unit tests

- lifecycle transitions;
- decision supersession;
- candidate acceptance;
- link constraints;
- object merge;
- permission checks.

#### Integration tests

- transaction and outbox behavior;
- source idempotency;
- migration reruns;
- candidate-to-canonical conversion;
- recursive context retrieval.

#### End-to-end tests

- create full product chain;
- import suggestion as evidence;
- accept candidate problem;
- supersede decision;
- record outcome;
- viewer cannot mutate;
- editor cannot manage workspace membership.

#### AI evaluation

Maintain a small labelled dataset for:

- duplicate evidence;
- evidence-to-problem links;
- problem cluster quality;
- decision extraction.

Never rely only on anecdotal prompt testing.

### Feature flags

Suggested flags:

```text
product_context_v2
product_context_migration
intelligence_candidates
github_integration
agent_context_api
mcp_server
```

### Data fixtures

Create a realistic demo product graph and use it across:

- development;
- design;
- tests;
- screenshots;
- onboarding;
- demos.

## 11. Suggested ticket sequence for Phase 1

1. Add product-object and object-link schema.
2. Add application-layer object repository.
3. Add authorization helpers.
4. Implement problem commands and routes.
5. Build problems list.
6. Build problem detail shell.
7. Implement manual evidence.
8. Implement evidence linking.
9. Implement decisions and alternatives.
10. Implement supersession.
11. Implement solutions.
12. Implement outcomes.
13. Add activity timeline.
14. Add full-text search.
15. Add end-to-end vertical-slice test.
16. Add demo dataset.
17. Add feature flag and internal onboarding.

## 12. Definition of private beta

The product is ready for private beta when:

- a new workspace can activate without developer intervention;
- current InsightsWall data can be imported safely;
- a PM can complete the full context lifecycle;
- candidate provenance is always visible;
- permissions are enforced;
- error monitoring is installed;
- backup and restore are tested;
- at least three teams use real product context for two weeks;
- the team can identify what brings users back weekly.
