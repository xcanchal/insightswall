# Shared Product Context demo fixture

Status: Canonical Phase 1 fixture

Use the same semantic data in unit tests, integration tests, browser tests, demo seeding, screenshots, and onboarding. IDs may be deterministic per test environment, but names and relationships remain stable.

## Product

```text
Name: Atlas Analytics
Visibility: Private
```

## Problem

```text
Title: Customers cannot organize large dashboard collections
Summary: Teams with many dashboards struggle to find and group related work.
```

## Evidence

1. Customer feedback
   - “Our workspace has more than 80 dashboards and nobody can find the right one.”
2. Support pattern
   - Twelve organization-related support requests were recorded this quarter.
3. Interview note
   - Administrators group dashboard links in external documents as a workaround.

## Decision

```text
Question: How should customers organize dashboards?
Outcome: Use one-level collections rather than nested folders.
Rationale: Collections solve the dominant retrieval problem without introducing tree-management complexity.
```

Alternatives:

1. Nested folders — rejected because hierarchy management adds complexity.
2. Tags only — rejected because customers asked for visible grouping and browsing.
3. One-level collections — selected.

## Solution

```text
Title: Dashboard collections
Hypothesis: One-level collections let teams group and retrieve dashboards without managing a hierarchy.
Stage: Shipped
```

## Outcome

```text
Result: Dashboard-organization support requests decreased 31%.
Numeric value: 31
Unit: percent decrease
```

## Required relationships

```text
All three Evidence items SUPPORT the Problem.
Relevant Evidence SUPPORTS the Decision.
The Problem LED_TO the Decision.
The Decision SELECTS the Solution.
The Solution ADDRESSES the Problem.
The Solution is MEASURED_BY the Outcome.
```

Tests may use only the subset relevant to their scope, but must not replace the canonical scenario with unrelated examples.
