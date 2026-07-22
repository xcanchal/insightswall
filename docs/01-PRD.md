# Product Requirements Document

## 1. Product summary

InsightsWall Product Context is a workspace where software teams maintain the canonical reasoning behind their product.

It connects:

- evidence from customers and internal sources;
- durable product problems;
- decisions and alternatives;
- proposed and implemented solutions;
- releases;
- measured outcomes;
- principles and constraints.

The product is useful directly to product teams and indirectly to engineers, support, sales, marketing, leadership, and AI agents.

## 2. Product statement

> The system where product decisions live, with their evidence, rationale, implementation, and outcomes.

A useful secondary line:

> Git remembers what changed. InsightsWall remembers why.

## 3. Problem

Product reasoning is fragmented across:

- customer feedback tools;
- support tickets;
- Slack discussions;
- interview notes;
- Linear or Jira;
- GitHub issues and pull requests;
- analytics dashboards;
- documents and presentations;
- individual memory.

Existing tools preserve fragments but rarely preserve the full chain:

```text
Evidence → Problem → Decision → Solution → Release → Outcome
```

This causes recurring failure modes:

- teams repeat discussions because previous rationale is lost;
- feature requests are prioritized without understanding the underlying problem;
- engineering receives tasks without business context or constraints;
- product decisions live in ephemeral chat;
- shipped work is not connected to its original hypothesis;
- outcomes are not reviewed;
- AI agents can read code but lack reliable product context.

## 4. Opportunity

The rise of AI coding and operational agents increases the value of reliable, structured product context. Agents need more than documents and semantic search. They need accepted, source-backed knowledge about:

- why a feature exists;
- who is affected;
- which alternatives were rejected;
- which constraints apply;
- what success means;
- what happened after release.

The same structure is valuable to humans even without AI.

## 5. Goals

### Primary goals

1. Give product teams one place to understand the complete context of a product problem.
2. Make meaningful product decisions durable, searchable, reviewable, and linked to evidence.
3. Reduce manual documentation through ingestion, extraction, and human review.
4. Make product context consumable by humans and agents through the same underlying model.
5. Reuse the existing InsightsWall platform without preserving the wrong feedback-centric assumptions.

### Secondary goals

- Improve collaboration between product and engineering.
- Help teams close the loop with customers.
- Establish a history of superseded decisions and changing evidence.
- Enable proactive signals such as emerging problems and stale decisions.

## 6. Non-goals

The initial product will not:

- replace Linear, Jira, or GitHub as execution systems;
- replace Slack or Notion as general communication and documentation tools;
- become a general company knowledge base;
- autonomously make final product decisions;
- support a broad public roadmap experience;
- provide a visual graph editor;
- synchronize every source bidirectionally;
- infer financial impact without traceable source data;
- expose an MCP server before the core workflow is validated.

## 7. Target users

### 7.1 Product manager

Needs to:

- understand emerging and validated problems;
- review evidence;
- record decisions and alternatives;
- connect solutions to the problems they address;
- revisit decisions when evidence changes;
- measure post-release outcomes.

### 7.2 Head of Product / Product Operations

Needs to:

- establish decision discipline across teams;
- find duplicated or contradictory work;
- understand decision history;
- see which shipped solutions lack outcomes;
- improve the quality and consistency of product context.

### 7.3 Founder or small product team

Needs a lightweight way to connect customer feedback, decisions, implementation, and learning without adopting a heavy product-operations stack.

### 7.4 Engineer or technical lead

Needs to answer:

- Why are we building this?
- What constraints apply?
- What was tried before?
- Which customer problem should this solve?
- How will success be measured?

### 7.5 AI agent

Needs machine-readable, source-backed context before acting and a safe way to propose updates afterward.

## 8. Jobs to be done

### Core jobs

- When I investigate a product area, help me collect all relevant evidence so I can define the real problem.
- When the team reaches a decision, help me preserve the rationale and alternatives without writing a long document.
- When engineering starts implementation, provide the relevant problem, decisions, and constraints.
- When a feature ships, help me connect the release to the original problem and define what to measure.
- When new evidence appears, show whether it strengthens, contradicts, or changes an existing problem or decision.
- When someone asks why the product behaves a certain way, provide an answer with sources.

### Emotional jobs

- Reduce anxiety that important context will disappear.
- Increase confidence that decisions are evidence-backed.
- Prevent the feeling that the team keeps relearning the same lessons.
- Make product work feel coherent rather than fragmented.

## 9. Product principles

1. **AI proposes; humans establish truth.**
2. **Provenance before persuasion.** Every important claim should show where it came from.
3. **Problems before features.**
4. **Capture from existing work, not additional bureaucracy.**
5. **Structured enough for agents, natural enough for humans.**
6. **Integrate with execution tools instead of replacing them.**
7. **History is part of the product.** Superseded decisions are retained, not erased.
8. **The graph is the model, not necessarily the interface.**
9. **Useful manually before automated.**
10. **Trust compounds slowly and is lost quickly.**

## 10. Core concepts

### Evidence

A source-backed observation, request, measurement, conversation, or artifact.

Examples:

- customer feedback;
- support ticket;
- interview excerpt;
- sales note;
- Slack thread;
- GitHub issue or pull request;
- analytics observation;
- manually added note.

### Problem

A durable description of user or business pain. Problems aggregate evidence and are the main prioritization unit.

### Decision

A meaningful choice with:

- a question;
- an outcome;
- rationale;
- alternatives;
- owner;
- date;
- evidence;
- consequences;
- optional review date;
- supersession history.

### Solution

A proposed or implemented response to one or more problems. “Solution” is preferred over “Feature” because the response may be an experiment, operational change, pricing change, or removal.

### Release

A moment when a solution reaches users or an internal audience.

### Outcome

An observed result after a solution or release.

### Principle

A durable product guideline used to evaluate decisions.

### Constraint

A technical, legal, security, commercial, or platform limitation.

## 11. MVP scope

The MVP must let a product team:

1. Create a product.
2. Create or import evidence.
3. Create a problem.
4. Link evidence to the problem.
5. Record a decision with rationale and alternatives.
6. Link a solution to the problem and decision.
7. Record an outcome.
8. View a complete problem context page.
9. Search across objects.
10. Review AI-generated candidate links or candidate problems from existing feedback.
11. See provenance and activity history.

### MVP object set

- Product
- Evidence
- Problem
- Decision
- Solution
- Outcome
- Object link
- Comment
- Activity event
- Intelligence candidate

### Deferred object types

- Release
- Principle
- Constraint
- Customer/account
- Experiment
- Metric definition
- Segment
- Repository/code area

The data model should support adding them without requiring a rewrite.

## 12. Functional requirements

### 12.1 Product graph

- Users can create, update, archive, and restore supported object types.
- Users can create typed relationships between objects.
- Every relationship records its origin: manual, imported, or AI-suggested.
- Object history is retained.
- Deleted source artifacts do not silently delete accepted canonical objects.

### 12.2 Evidence

- Evidence preserves source type, source URL where available, external ID, author, original timestamp, and raw or normalized content.
- Evidence may support or contradict multiple problems.
- Duplicate evidence imports are idempotent.
- Users can manually paste evidence.
- Current InsightsWall suggestions can be imported as evidence.

### 12.3 Problems

- Problems support lifecycle states:
  - Emerging
  - Investigating
  - Validated
  - Being addressed
  - Monitoring
  - Resolved
  - Archived
- Problems display evidence volume and source mix.
- Problems can be merged while retaining aliases and history.
- Problems can have owners, affected segments, impact notes, and confidence.

### 12.4 Decisions

- Decisions support:
  - Proposed
  - Accepted
  - Rejected
  - Superseded
- A decision includes question, outcome, rationale, alternatives, consequences, owner, decided date, and optional review date.
- Users can supersede rather than overwrite decisions.
- Decisions can link to problems, evidence, constraints, principles, and solutions.
- The system warns when a new decision may conflict with an accepted decision.

### 12.5 Solutions and outcomes

- Solutions link to one or more problems.
- Solutions can be proposed, planned, in progress, shipped, or abandoned.
- Outcomes can be qualitative or quantitative.
- A shipped solution can be flagged as missing an outcome.
- Outcomes always show their observation source.

### 12.6 Intelligence review queue

The system can propose:

- evidence-to-problem links;
- duplicate evidence;
- candidate problems;
- candidate decisions extracted from text;
- possible contradictions;
- missing outcome reminders.

Users can:

- accept;
- edit and accept;
- reject;
- merge;
- postpone.

No candidate becomes canonical knowledge until accepted in the initial versions.

### 12.7 Search and context

- Search works across titles, summaries, source text, and relationships.
- Result pages show object type and relevant context.
- “Explain why” answers cite canonical objects and source artifacts.
- Answers must not hide uncertainty.

### 12.8 Permissions

Initial roles:

- Workspace owner
- Admin
- Editor
- Viewer

Permissions apply at workspace/product level. Fine-grained object permissions are deferred unless current customers require them.

## 13. Main product surfaces

1. **Today / Intelligence Inbox**
2. **Problems**
3. **Problem Detail**
4. **Decisions**
5. **Evidence**
6. **Solutions**
7. **Review Queue**
8. **Search / Ask**
9. **Integrations**
10. **Product Settings**

## 14. Key user stories

### Discovery

As a PM, I want imported feedback grouped into candidate problems so that I can review themes instead of reading every item individually.

### Decision capture

As a PM, I want to turn a discussion into a structured decision so that the rationale remains available later.

### Engineering context

As an engineer, I want to view the problem, decision, and constraints linked to my work so that I implement the intended outcome.

### Post-release learning

As a PM, I want to record whether the original problem improved so that product knowledge includes outcomes, not only plans.

### Leadership

As a Head of Product, I want to find shipped solutions without measured outcomes so that teams close the learning loop.

### Agent use

As an AI coding agent, I want structured product context for a task so that I can act consistently with prior decisions and constraints.

## 15. Success metrics

### Activation

A workspace:

- imports or creates at least five evidence items;
- accepts or creates one problem;
- records one decision;
- links one solution.

### Workflow value

- Median time to answer “Why does this exist?” is under one minute.
- At least 60% of active solutions are linked to a problem and decision.
- At least 40% of shipped solutions have a recorded or scheduled outcome in early beta.

### Intelligence quality

- At least 60% of candidate evidence links are accepted.
- At least 40% of candidate problems are accepted or merged after editing.
- Fewer than 10% of accepted candidates are later removed as materially incorrect.

### Habit

- Active beta workspaces review context or candidates weekly.
- At least two distinct roles consume context in retained workspaces.

### Trust

- Every AI-produced answer exposes its supporting objects and sources.
- Users can identify whether content was manual, imported, or AI-proposed.

## 16. Product risks

### Documentation burden

If value depends on teams manually documenting every decision, usage will collapse.

**Mitigation:** capture from existing work, offer short structured forms, generate drafts, and make review faster than writing.

### Incorrect AI interpretation

Confident but wrong candidates will damage trust.

**Mitigation:** separate candidates from canonical truth, show evidence, record confidence, and require review.

### Ontology complexity

Too many object types may feel academic.

**Mitigation:** launch with Evidence, Problem, Decision, Solution, and Outcome.

### Integration trap

Building connectors can consume the project before the workflow is validated.

**Mitigation:** begin with existing InsightsWall data, paste/import flows, and one read-only integration.

### Replacement anxiety

Teams may assume the product wants to replace Linear, Notion, or Slack.

**Mitigation:** position it explicitly as the reasoning and context layer.

## 17. Open product decisions

1. Is “InsightsWall” retained as the product name?
2. Is “Solution” understandable enough, or should the UI say “Initiative” or “Feature”?
3. Is the primary landing surface Today, Problems, or Review Queue?
4. Which first external integration provides the clearest value: Linear, GitHub, or Slack?
5. Should a lightweight private roadmap remain as a solution view?
6. Should evidence be editable, or should edits create annotations while the original remains immutable?
7. When can low-risk candidates be auto-accepted?
8. Is the first buyer a Head of Product, Product Operations, or founder-led product team?
