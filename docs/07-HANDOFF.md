# InsightsWall Product Context v2

## Mission

Inspect the existing InsightsWall repository and prepare an implementation plan for evolving it into a product-context platform.

The new product connects:

```text
Evidence → Problem → Decision → Solution → Release → Outcome
```

The platform must preserve source provenance and separate AI-generated candidates from human-accepted canonical knowledge.

## First instruction

Do not start coding immediately.

First produce a repository-specific assessment covering:

1. Current architecture and package structure.
2. Existing domain entities and database schema.
3. Authentication and authorization.
4. Workspace/project boundaries.
5. Comments, notifications, activity, and attachments.
6. Background-job capabilities.
7. Search implementation.
8. Current feedback and roadmap coupling.
9. Migration tooling.
10. Exact reusable modules and required replacements.

## Product constraints

- Reuse the existing repository and platform foundation.
- Do not rename `suggestions` directly into `problems`.
- Import current suggestions as Evidence.
- Problems are canonical product objects created manually or through reviewed candidates.
- AI cannot mutate canonical product knowledge without an explicit accepted workflow.
- Use PostgreSQL as a relational graph.
- Keep a modular monolith.
- Do not add Neo4j, Kafka, event sourcing, or a separate vector database.
- Do not build MCP in the first milestone.
- Do not replace Linear, Jira, GitHub, Slack, or Notion.
- Private product context is the default.
- Public roadmap functionality is optional and deferred.

## MVP vertical slice

Implement the smallest complete chain:

1. Create Product.
2. Create Problem.
3. Add manual Evidence.
4. Link Evidence to Problem.
5. Create Decision with rationale and alternatives.
6. Link Decision to Problem and Evidence.
7. Create Solution.
8. Link Solution to Problem and Decision.
9. Record Outcome.
10. Navigate the full context from the Problem detail page.
11. See activity history.
12. Search objects.

## Core tables

Expected direction:

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
outbox_events
```

Later:

```text
source_connections
source_artifacts
intelligence_candidates
intelligence_candidate_sources
releases
principles
constraints
```

Adapt names to repository conventions only when semantics remain clear.

## Required architectural properties

### Product graph

- Shared object identity.
- Type-specific detail tables.
- Typed directed links.
- Same-product constraint.
- Archive rather than destructive delete by default.
- Merge support for Problems.
- Supersession support for Decisions.

### Provenance

Every Evidence item and accepted candidate must reveal its source.

### History

All meaningful mutations produce an activity event. Decisions retain versions and supersession history.

### Application services

Business logic belongs in reusable commands and queries, not route handlers or UI components.

Expected commands:

```text
CreateProblem
CreateEvidence
LinkEvidenceToProblem
CreateDecision
SupersedeDecision
CreateSolution
RecordOutcome
CreateObjectLink
```

Expected queries:

```text
ListProblems
GetProblemContext
ListDecisions
SearchProductContext
```

## Recommended implementation steps

### Step 1 — Audit

Produce:

```text
docs/product-context/repository-audit.md
```

Include:

- current schema diagram;
- module map;
- reuse matrix;
- migration risks;
- recommended file changes;
- unresolved questions.

### Step 2 — ADRs

Add repository-specific ADRs for:

- reuse of existing repository;
- new v2 domain tables;
- PostgreSQL relational graph;
- modular monolith;
- candidate/canonical separation;
- migration approach.

### Step 3 — Schema

Add migrations for the Phase 1 tables.

Requirements:

- foreign keys;
- useful indexes;
- same-product relationship enforcement;
- timestamps;
- archive support;
- idempotent migrations.

### Step 4 — Domain/application layer

Implement commands and queries with unit tests before building complete screens.

### Step 5 — API

Expose routes following existing Hono conventions. Validate inputs and permissions at application boundaries.

### Step 6 — UI shell

Add feature-flagged v2 navigation:

```text
Today
Problems
Decisions
Solutions
Evidence
Review
Search
```

For Phase 1, Today and Review may be simple placeholders.

### Step 7 — Full vertical slice

Build the Problem detail page and complete chain.

### Step 8 — Tests and fixture

Create one realistic fixture:

```text
Problem:
Customers cannot organize large dashboard collections.

Evidence:
Feedback, support, and interview notes.

Decision:
One-level collections rather than nested folders.

Solution:
Collections.

Outcome:
Support requests decreased 31%.
```

Use the same fixture for unit, integration, end-to-end, and demo data.

## Definition of done for Phase 1

- Existing application still works behind its current routes.
- V2 is behind a feature flag.
- Users can complete the full context chain.
- Authorization is enforced server-side.
- Object history is visible.
- Search works.
- Tests cover lifecycle invariants.
- No AI or integration dependency is required.
- Schema and architecture documentation match the implementation.

## Phase 2 direction

After Phase 1:

- create Source Artifacts from current suggestions;
- import suggestions as Evidence;
- preserve vote signals and comments;
- map roadmap items to Solution candidates;
- generate candidate Problems only through a review workflow.

## Output expected from Codex before implementation

Return:

1. Repository audit.
2. Proposed file/module changes.
3. Updated database diagram.
4. Migration sequence.
5. Risk list.
6. Milestone breakdown.
7. Questions requiring product decisions.
8. A first implementation PR plan small enough to review safely.
