# Database and API Design

## 1. Design goals

The schema must:

- preserve the difference between source data, AI candidates, and canonical knowledge;
- support typed product objects and relationships;
- allow type-specific fields without an unbounded EAV model;
- support version history and provenance;
- remain compatible with PostgreSQL and Drizzle;
- allow incremental migration from current InsightsWall data.

## 2. High-level ER diagram

```mermaid
erDiagram
    WORKSPACES ||--o{ PRODUCTS : owns
    WORKSPACES ||--o{ WORKSPACE_MEMBERS : has
    USERS ||--o{ WORKSPACE_MEMBERS : joins

    PRODUCTS ||--o{ PRODUCT_OBJECTS : contains
    PRODUCT_OBJECTS ||--o| PROBLEMS : "typed as"
    PRODUCT_OBJECTS ||--o| EVIDENCE : "typed as"
    PRODUCT_OBJECTS ||--o| DECISIONS : "typed as"
    PRODUCT_OBJECTS ||--o| SOLUTIONS : "typed as"
    PRODUCT_OBJECTS ||--o| RELEASES : "typed as"
    PRODUCT_OBJECTS ||--o| OUTCOMES : "typed as"
    PRODUCT_OBJECTS ||--o| PRINCIPLES : "typed as"
    PRODUCT_OBJECTS ||--o| CONSTRAINTS : "typed as"

    PRODUCT_OBJECTS ||--o{ OBJECT_LINKS : from
    PRODUCT_OBJECTS ||--o{ OBJECT_LINKS : to

    PRODUCTS ||--o{ SOURCE_CONNECTIONS : configures
    SOURCE_CONNECTIONS ||--o{ SOURCE_ARTIFACTS : imports
    SOURCE_ARTIFACTS ||--o{ INTELLIGENCE_CANDIDATE_SOURCES : supports

    PRODUCTS ||--o{ INTELLIGENCE_CANDIDATES : receives
    INTELLIGENCE_CANDIDATES ||--o{ INTELLIGENCE_CANDIDATE_SOURCES : cites

    PRODUCT_OBJECTS ||--o{ COMMENTS : has
    PRODUCT_OBJECTS ||--o{ PRODUCT_OBJECT_VERSIONS : versions
    PRODUCTS ||--o{ ACTIVITY_EVENTS : records
    PRODUCTS ||--o{ OUTBOX_EVENTS : emits
```

## 3. Core tables

### 3.1 `products`

Represents the product boundary.

```sql
products (
  id uuid primary key,
  workspace_id uuid not null references workspaces(id),
  name text not null,
  slug text not null,
  description text,
  visibility text not null default 'PRIVATE',
  created_by uuid not null references users(id),
  created_at timestamptz not null,
  updated_at timestamptz not null,
  archived_at timestamptz,
  unique(workspace_id, slug)
)
```

The existing `projects` table may be evolved into this role if its semantics are already close enough. Keep the external concept “Product” even if the physical table initially remains `projects`.

### 3.2 `product_objects`

Shared node identity.

```sql
product_objects (
  id uuid primary key,
  product_id uuid not null references products(id),
  kind text not null,
  title text not null,
  summary text,
  status text not null,
  owner_id uuid references users(id),
  created_by uuid not null references users(id),
  created_at timestamptz not null,
  updated_at timestamptz not null,
  archived_at timestamptz,
  merged_into_id uuid references product_objects(id),
  search_document tsvector
)
```

Suggested `kind` values:

```text
EVIDENCE
PROBLEM
DECISION
SOLUTION
RELEASE
OUTCOME
PRINCIPLE
CONSTRAINT
```

Do not enforce all kind-specific status values in one database enum. Validate status per type in application code and optionally with check constraints.

### 3.3 `object_links`

Typed directed edges.

```sql
object_links (
  id uuid primary key,
  product_id uuid not null references products(id),
  from_object_id uuid not null references product_objects(id),
  to_object_id uuid not null references product_objects(id),
  relationship_type text not null,
  origin text not null,
  confidence numeric(5,4),
  source_candidate_id uuid references intelligence_candidates(id),
  created_by uuid references users(id),
  created_at timestamptz not null,
  archived_at timestamptz,
  unique(from_object_id, to_object_id, relationship_type)
)
```

Suggested relationship types:

```text
SUPPORTS
CONTRADICTS
AFFECTS
RELATES_TO
LED_TO
ADDRESSES
SELECTS
IMPLEMENTS
SHIPPED_IN
MEASURED_BY
VALIDATES
INVALIDATES
GUIDES
CONSTRAINS
SUPERSEDES
DUPLICATES
BLOCKS
DEPENDS_ON
```

Origin values:

```text
MANUAL
IMPORT
AI_ACCEPTED
SYSTEM
MIGRATION
```

### 3.4 `evidence`

```sql
evidence (
  object_id uuid primary key references product_objects(id),
  evidence_type text not null,
  source_artifact_id uuid references source_artifacts(id),
  observed_at timestamptz,
  source_author text,
  source_url text,
  original_content text,
  normalized_content text,
  metadata jsonb not null default '{}'
)
```

Suggested evidence types:

```text
CUSTOMER_FEEDBACK
SUPPORT_TICKET
INTERVIEW
SALES_NOTE
SLACK_DISCUSSION
GITHUB_ISSUE
GITHUB_PULL_REQUEST
ANALYTICS_OBSERVATION
DOCUMENT
MANUAL_NOTE
```

### 3.5 `problems`

```sql
problems (
  object_id uuid primary key references product_objects(id),
  stage text not null,
  confidence text,
  severity text,
  impact_summary text,
  affected_segments jsonb not null default '[]',
  first_observed_at timestamptz,
  last_observed_at timestamptz
)
```

### 3.6 `decisions`

```sql
decisions (
  object_id uuid primary key references product_objects(id),
  question text not null,
  outcome text,
  rationale text,
  consequences text,
  decided_at timestamptz,
  review_at timestamptz,
  superseded_by_object_id uuid references product_objects(id)
)
```

### 3.7 `decision_alternatives`

```sql
decision_alternatives (
  id uuid primary key,
  decision_object_id uuid not null references decisions(object_id),
  title text not null,
  description text,
  disposition text,
  rejection_reason text,
  sort_order integer not null default 0
)
```

### 3.8 `solutions`

```sql
solutions (
  object_id uuid primary key references product_objects(id),
  stage text not null,
  hypothesis text,
  expected_outcome text,
  external_execution_url text,
  started_at timestamptz,
  shipped_at timestamptz
)
```

### 3.9 `releases`

```sql
releases (
  object_id uuid primary key references product_objects(id),
  version text,
  released_at timestamptz,
  release_url text,
  environment text,
  metadata jsonb not null default '{}'
)
```

### 3.10 `outcomes`

```sql
outcomes (
  object_id uuid primary key references product_objects(id),
  outcome_type text not null,
  result text not null,
  numeric_value numeric,
  unit text,
  observed_at timestamptz not null,
  source_artifact_id uuid references source_artifacts(id),
  confidence text
)
```

### 3.11 `principles`

```sql
principles (
  object_id uuid primary key references product_objects(id),
  statement text not null,
  explanation text,
  active_from timestamptz,
  active_until timestamptz
)
```

### 3.12 `constraints`

```sql
constraints (
  object_id uuid primary key references product_objects(id),
  constraint_type text not null,
  description text not null,
  active_from timestamptz,
  active_until timestamptz,
  source_artifact_id uuid references source_artifacts(id)
)
```

## 4. Source ingestion tables

### 4.1 `source_connections`

```sql
source_connections (
  id uuid primary key,
  product_id uuid not null references products(id),
  source_type text not null,
  display_name text not null,
  status text not null,
  encrypted_credentials jsonb,
  configuration jsonb not null default '{}',
  sync_cursor jsonb,
  last_synced_at timestamptz,
  created_by uuid not null references users(id),
  created_at timestamptz not null,
  updated_at timestamptz not null
)
```

### 4.2 `source_artifacts`

```sql
source_artifacts (
  id uuid primary key,
  product_id uuid not null references products(id),
  connection_id uuid references source_connections(id),
  source_type text not null,
  external_id text,
  external_parent_id text,
  source_url text,
  title text,
  raw_content text,
  normalized_content text,
  author jsonb,
  metadata jsonb not null default '{}',
  occurred_at timestamptz,
  ingested_at timestamptz not null,
  content_hash text not null,
  deleted_at_source timestamptz,
  unique(connection_id, external_id)
)
```

For manually pasted content, `connection_id` may be null and `source_type = MANUAL_IMPORT`.

## 5. Candidate tables

### 5.1 `intelligence_candidates`

```sql
intelligence_candidates (
  id uuid primary key,
  product_id uuid not null references products(id),
  candidate_type text not null,
  status text not null,
  title text,
  payload jsonb not null,
  confidence numeric(5,4),
  rationale text,
  model_provider text,
  model_name text,
  prompt_version text,
  extraction_version text,
  assigned_to uuid references users(id),
  created_at timestamptz not null,
  reviewed_by uuid references users(id),
  reviewed_at timestamptz,
  accepted_object_id uuid references product_objects(id),
  rejection_reason text
)
```

Candidate types:

```text
EVIDENCE_LINK
DUPLICATE_EVIDENCE
PROBLEM
PROBLEM_MERGE
DECISION
OBJECT_LINK
CONTRADICTION
OUTCOME_REMINDER
PRINCIPLE_CONFLICT
```

Candidate statuses:

```text
PENDING
ACCEPTED
EDITED_AND_ACCEPTED
REJECTED
DUPLICATE
SNOOZED
EXPIRED
```

### 5.2 `intelligence_candidate_sources`

```sql
intelligence_candidate_sources (
  candidate_id uuid not null references intelligence_candidates(id),
  source_artifact_id uuid not null references source_artifacts(id),
  relevance numeric(5,4),
  excerpt text,
  primary key(candidate_id, source_artifact_id)
)
```

## 6. History and activity

### 6.1 `product_object_versions`

```sql
product_object_versions (
  id uuid primary key,
  object_id uuid not null references product_objects(id),
  version integer not null,
  snapshot jsonb not null,
  changed_by uuid references users(id),
  change_reason text,
  created_at timestamptz not null,
  unique(object_id, version)
)
```

### 6.2 `activity_events`

```sql
activity_events (
  id uuid primary key,
  product_id uuid not null references products(id),
  actor_type text not null,
  actor_user_id uuid references users(id),
  actor_agent_id text,
  event_type text not null,
  object_id uuid references product_objects(id),
  candidate_id uuid references intelligence_candidates(id),
  metadata jsonb not null default '{}',
  occurred_at timestamptz not null
)
```

## 7. Outbox

```sql
outbox_events (
  id uuid primary key,
  aggregate_type text not null,
  aggregate_id uuid not null,
  event_type text not null,
  payload jsonb not null,
  created_at timestamptz not null,
  available_at timestamptz not null,
  claimed_at timestamptz,
  processed_at timestamptz,
  attempts integer not null default 0,
  last_error text
)
```

## 8. Important constraints and indexes

### Constraints

- `from_object_id != to_object_id` except explicitly allowed self-referential relationship types.
- Both objects in an `object_link` must belong to the same product.
- Detail table type must match `product_objects.kind`.
- A superseding decision must belong to the same product.
- Accepted candidates are immutable except for administrative correction.
- Source artifact import is idempotent.

### Indexes

```text
product_objects(product_id, kind, status)
product_objects(product_id, updated_at desc)
object_links(product_id, from_object_id, relationship_type)
object_links(product_id, to_object_id, relationship_type)
source_artifacts(connection_id, external_id)
source_artifacts(product_id, source_type, occurred_at desc)
source_artifacts(product_id, content_hash)
intelligence_candidates(product_id, status, created_at desc)
activity_events(product_id, occurred_at desc)
outbox_events(processed_at, available_at)
GIN product_objects(search_document)
```

Embeddings can be added with `pgvector` later:

```text
source_artifacts.embedding
product_objects.embedding
```

Do not add embeddings before the first duplicate/linking use case is implemented.

## 9. Application commands

Commands mutate state and enforce invariants.

```text
CreateProblem
UpdateProblem
MergeProblems
ArchiveProductObject

CreateEvidenceFromManualInput
ImportSourceArtifactAsEvidence
LinkEvidenceToProblem

CreateDecision
AcceptDecision
RejectDecision
SupersedeDecision
ScheduleDecisionReview

CreateSolution
UpdateSolutionStage
LinkSolutionToProblem
MarkSolutionShipped

RecordOutcome

CreateObjectLink
ArchiveObjectLink

AcceptCandidate
EditAndAcceptCandidate
RejectCandidate
SnoozeCandidate

ConnectSource
SyncSource
DisconnectSource
```

## 10. Application queries

```text
GetTodayFeed
ListProblems
GetProblemContext
ListDecisions
GetDecisionContext
ListEvidence
ListReviewQueue
SearchProductContext
ExplainObject
BuildAgentContext
ListUnmeasuredShippedSolutions
ListStaleDecisions
```

## 11. REST API outline

The exact route naming should fit the existing API conventions.

```text
GET    /products/:productId/today

GET    /products/:productId/objects
POST   /products/:productId/problems
GET    /products/:productId/problems/:problemId
PATCH  /products/:productId/problems/:problemId
POST   /products/:productId/problems/:problemId/merge

POST   /products/:productId/evidence
GET    /products/:productId/evidence/:evidenceId

POST   /products/:productId/decisions
GET    /products/:productId/decisions/:decisionId
PATCH  /products/:productId/decisions/:decisionId
POST   /products/:productId/decisions/:decisionId/accept
POST   /products/:productId/decisions/:decisionId/supersede

POST   /products/:productId/solutions
PATCH  /products/:productId/solutions/:solutionId
POST   /products/:productId/outcomes

POST   /products/:productId/links
DELETE /products/:productId/links/:linkId

GET    /products/:productId/candidates
POST   /products/:productId/candidates/:candidateId/accept
POST   /products/:productId/candidates/:candidateId/reject
POST   /products/:productId/candidates/:candidateId/snooze

GET    /products/:productId/search?q=
POST   /products/:productId/context:build

GET    /products/:productId/source-connections
POST   /products/:productId/source-connections
POST   /products/:productId/source-connections/:id/sync
DELETE /products/:productId/source-connections/:id
```

## 12. API response conventions

Every canonical object response should include:

```json
{
  "id": "uuid",
  "kind": "PROBLEM",
  "title": "Customers cannot organize large dashboard collections",
  "summary": "...",
  "status": "VALIDATED",
  "owner": {},
  "createdAt": "...",
  "updatedAt": "...",
  "provenance": {
    "origin": "MANUAL",
    "acceptedFromCandidateId": null
  },
  "links": [],
  "permissions": {
    "canEdit": true,
    "canArchive": true,
    "canLink": true
  }
}
```

Candidate responses should clearly separate proposed values from existing canonical values.

## 13. Context API

Example request:

```json
{
  "subject": {
    "type": "object",
    "objectId": "problem-uuid"
  },
  "include": [
    "evidence",
    "decisions",
    "solutions",
    "constraints",
    "outcomes"
  ],
  "maxDepth": 2,
  "maxItems": 40
}
```

Example response shape:

```json
{
  "subject": {},
  "summary": "Enterprise teams struggle to organize large dashboard sets...",
  "objects": [],
  "relationships": [],
  "sources": [],
  "conflicts": [],
  "staleness": [],
  "generatedAt": "...",
  "contextVersion": "1"
}
```

## 14. Future MCP tools

MCP should wrap application commands and queries.

Read tools:

```text
get_product_context
explain_feature
find_relevant_decisions
find_constraints
find_problem_evidence
search_product_context
```

Write tools:

```text
propose_decision
propose_object_link
link_pull_request
record_outcome
```

Write tools should create candidates by default rather than directly modifying canonical knowledge.

## 15. Suggested Drizzle organization

```text
db/
  schema/
    products.ts
    product-objects.ts
    object-links.ts
    evidence.ts
    problems.ts
    decisions.ts
    solutions.ts
    outcomes.ts
    source-connections.ts
    source-artifacts.ts
    intelligence-candidates.ts
    activity-events.ts
    outbox-events.ts
```

Avoid one giant schema file.

## 16. Migration-safe implementation order

1. Add new tables without changing existing routes.
2. Add v2 product-context modules behind a feature flag.
3. Create migration/import jobs from current suggestions.
4. Run both domains side by side during internal testing.
5. Make Product Context the default workspace.
6. Archive or remove old feedback-specific views after migration verification.
