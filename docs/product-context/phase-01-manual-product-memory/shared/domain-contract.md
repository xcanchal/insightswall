# Minimal domain contract

Status: Accepted on 2026-07-22

## Objects

```text
PROBLEM
EVIDENCE
DECISION
SOLUTION
OUTCOME
```

Every object has shared identity, `project_id`, kind, title, optional summary, type-specific status, creator, timestamps, and optional archive time. Detail tables contain only fields needed by the fixture and first real use.

## Relationships

```text
EVIDENCE --SUPPORTS----> PROBLEM
EVIDENCE --SUPPORTS----> DECISION
PROBLEM  --LED_TO------> DECISION
DECISION --SELECTS-----> SOLUTION
SOLUTION --ADDRESSES---> PROBLEM
SOLUTION --MEASURED_BY-> OUTCOME
DECISION --SUPERSEDES---> DECISION
```

Links are directed, same-Project, unique while active, and archived rather than deleted through normal behavior.

## Permissions

```text
Unauthenticated       no access
Project non-member    no access
Project USER          read
Project ADMIN         read/write
```

Commands and queries enforce this policy. Routes also require authentication.

## History

- Every meaningful mutation writes an `activity_events` row in the same transaction.
- Decisions write `product_object_versions` for creation, meaningful edits/status changes, and supersession.
- Other objects need no version UI in the first slice.

## Evidence provenance

Manual Evidence includes original content, evidence type, observed time, and optional source label, author, and URL. Original content is not silently rewritten.

## Search

Search title and summary with case-insensitive matching inside one Project. Exclude archived objects by default. No ranking, stemming, embeddings, or separate index.

## Lifecycle scope

Use only states needed by the first slice:

```text
Problem: EMERGING, VALIDATED, ARCHIVED
Decision: PROPOSED, ACCEPTED, REJECTED, SUPERSEDED
Solution: PROPOSED, IN_PROGRESS, SHIPPED, ABANDONED
Outcome: RECORDED
Evidence: ACTIVE, ARCHIVED
```

Expose additional transitions only after a real workflow requires them.
