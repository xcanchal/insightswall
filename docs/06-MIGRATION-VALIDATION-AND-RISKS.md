# Migration, Validation, and Risks

## 1. Recommended strategic decision

Reuse the current InsightsWall repository and platform foundation, but introduce a clean v2 domain.

Do not:

- discard working platform infrastructure;
- force `suggestions` to become `problems`;
- preserve a public-roadmap assumption;
- maintain compatibility with every current feedback workflow if it damages the new model.

The migration principle:

> Preserve data and platform capability, not the old ontology.

## 2. Current-to-new mapping

| Current concept | New concept | Notes |
|---|---|---|
| Organization | Workspace | Reuse |
| Project | Product | Reuse or rename at application boundary |
| Project member | Product/workspace member | Reuse |
| Suggestion | Evidence: customer feedback | Never auto-convert directly to Problem |
| Suggestion vote | Evidence signal | Aggregate or retain as metadata |
| Suggestion comment | Evidence discussion | Promote only when it contains distinct evidence |
| Suggestion status | Source metadata | Does not define problem state |
| Roadmap item | Solution candidate | Completed items may also create Release candidates |
| Notification | Notification | Reuse |
| Comment | General object comment | Generalize |
| Activity | Audit/activity event | Strengthen |
| Public board | Optional evidence collection surface | Not core |
| Public roadmap | Optional private/public solution view | Deferred |

## 3. Migration stages

### Stage 1: Schema introduction

- Deploy new tables.
- No current behavior changes.
- Add feature flag.
- Add internal-only v2 routes.

### Stage 2: Workspace/product bridge

- Reuse existing workspace/project identity.
- Expose projects as Products in v2 UI.
- Verify permissions.

### Stage 3: Source artifact creation

For each suggestion:

1. Create a source artifact with `source_type = INIGHTSWALL_SUGGESTION`.
2. Preserve external/current ID.
3. Preserve content, author, timestamps, status, and URL.
4. Create canonical Evidence referencing that artifact.

### Stage 4: Signal migration

- Store vote count and available account/user metadata.
- Retain comments.
- Preserve old statuses as source metadata.
- Validate counts against current UI.

### Stage 5: Roadmap migration

- Create Solution candidates.
- Require review before making them canonical if mappings are ambiguous.
- Link source suggestions as evidence, not as problems.

### Stage 6: Candidate problem generation

- Cluster imported evidence.
- Generate candidate problems.
- Show similar existing problems.
- Let users merge, edit, accept, or reject.

### Stage 7: Cutover

- Make v2 default for internal use.
- Keep old views read-only temporarily.
- Compare records and permissions.
- Remove or archive old routes once migration confidence is high.

## 4. Migration safeguards

- Dry-run report.
- Idempotent migration key.
- Per-record migration status.
- Batch size and retry.
- Error export.
- Migration version.
- Audit trail linking old and new IDs.
- Staging rehearsal with production-like data.
- Backup before cutover.
- Ability to rebuild v2 from source artifacts during beta.

## 5. Product validation plan

The largest risk is not technical feasibility. It is whether teams will establish a new habit around product context.

### 5.1 Research participants

Interview:

- 2 product managers in established SaaS teams;
- 1 Head of Product or Product Operations;
- 1 founder-PM;
- 1 engineering lead working closely with product;
- optionally 1 support or customer-success lead.

### 5.2 Research questions

Avoid asking “Would you use this?”

Ask:

- Tell me about the last important product decision your team made.
- Where is the rationale now?
- How would a new engineer discover it?
- When did your team last repeat a discussion?
- How do you connect customer evidence to planned work?
- What happens after a feature ships?
- Which parts of this workflow require manual documentation?
- What would make you distrust an extracted decision?
- Which source would create the most immediate value if connected?
- Who would own this system?

### 5.3 Prototype tasks

1. Find why nested folders were rejected.
2. Review an emerging problem candidate.
3. Turn a discussion into a decision.
4. Find the evidence supporting a solution.
5. Record whether a release improved the problem.
6. Identify which shipped solution lacks an outcome.

Measure:

- task completion;
- time;
- terminology confusion;
- perceived value;
- willingness to maintain;
- trust in candidate output;
- existing tool the user expects this to replace or complement.

## 6. Validation hypotheses

### H1: Problem context is more valuable than feedback management

Evidence:

- users spend more time on problem detail than evidence list;
- users link multiple source types to a problem;
- users refer colleagues to a problem URL.

### H2: Decisions are a strong retention object

Evidence:

- users create or accept decisions weekly;
- decisions are revisited or linked later;
- engineering consumes decisions.

### H3: AI review is faster than manual documentation

Evidence:

- median candidate review under 30 seconds;
- accepted/edited candidates exceed rejected candidates;
- users describe the workflow as reducing work.

### H4: Outcomes create differentiation

Evidence:

- teams record outcomes;
- Today reminders are acted upon;
- problem status changes after outcome review.

### H5: Agent context is a meaningful wedge

Evidence:

- engineers request context from outside the UI;
- coding agents use context before implementation;
- PRs are linked back to product objects.

## 7. Beta cohort

Start with 3–5 teams that:

- ship software frequently;
- use Slack plus GitHub/Linear;
- have enough customer evidence to feel fragmentation;
- are small enough to change process;
- are willing to provide weekly feedback;
- do not require extensive enterprise security certifications immediately.

Avoid initial teams that:

- expect a full Jira replacement;
- require dozens of integrations;
- want an autonomous prioritization engine;
- have no product-management habit at all;
- cannot share source data with an LLM provider.

## 8. Pricing hypotheses

Pricing should be validated later. Plausible models:

### Workspace plus seats

- Base workspace/platform fee
- Paid editor/reviewer seats
- Free viewers

### Product plus intelligence usage

- Price per active product
- Included source artifacts or AI-processing allowance
- Overage or higher tier for integrations and agents

### Suggested early packaging

**Starter**

- One product
- Manual product graph
- Current InsightsWall evidence import
- Small team

**Team**

- Multiple products
- Intelligence candidates
- One or two integrations
- Decision reviews
- Agent context API

**Business**

- Advanced permissions
- SSO
- Retention controls
- Audit export
- More integrations and usage

Do not price per feedback item alone; the product value is broader.

## 9. Risk register

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Product becomes extra documentation | High | Critical | Capture from sources; fast review; immediate context value |
| AI candidates are unreliable | Medium | Critical | Human approval; citations; evaluation set; conservative scope |
| Users do not understand ontology | Medium | High | Five core objects; usability tests; plain-language UI |
| Existing code is tightly coupled to feedback | Medium | High | Repository audit; additive v2 modules; avoid unsafe renames |
| Integrations consume all development time | High | High | Existing data first; one read-only integration |
| Product is perceived as another knowledge base | Medium | High | Own product reasoning; problem/decision workflows; outcomes |
| Slack ingestion creates privacy concerns | High | High | Delay Slack; scoped channels; clear retention; redaction |
| No clear buyer | Medium | High | Test Head of Product, Product Ops, and founder-led teams |
| Teams prefer Linear custom fields/docs | Medium | Medium | Demonstrate cross-source context and decision history |
| Graph UI becomes a distraction | Medium | Medium | Keep graph in data model; use contextual sections |
| Public-roadmap legacy confuses positioning | Low | Medium | Disable by default; treat as optional solution view |
| LLM cost grows unexpectedly | Medium | Medium | Batch processing; candidate limits; usage telemetry |
| Source deletion conflicts with audit needs | Medium | High | Explicit retention semantics; admin controls |
| Agent write access damages trust | Medium | Critical | Write as candidate; scoped tokens; full audit |

## 10. Kill or pivot criteria

Reconsider the direction if, after a real beta:

- PMs consistently refuse to create or approve decisions;
- users only value feedback clustering and ignore decisions/outcomes;
- candidate review takes longer than manual work;
- no second role consumes the stored context;
- teams want a full task tracker rather than a context layer;
- problem pages are not revisited after creation;
- integrations are required before any manual workflow feels useful.

Possible narrower pivots:

- product decision register;
- feedback-to-problem intelligence;
- agent context for engineering;
- product outcome review;
- migration/knowledge extraction from Slack and Linear.

## 11. Open strategic decisions

### Naming

Options:

- InsightsWall
- Product Context
- Product Memory
- Product Graph
- Whybase
- ProductOS

Recommendation: retain InsightsWall as the code/product identity during validation. Rename only when the differentiated value is proven.

### Root navigation

Options:

- Today
- Problems
- Review

Recommendation: test Today as default for established workspaces and guided onboarding for empty ones.

### First external integration

Recommendation:

- GitHub when leading with engineering/agent context.
- Linear when leading with product workflow.
- Slack later.

### Public functionality

Recommendation:

- private by default;
- public feedback collection can remain optional;
- public roadmap is not a core product assumption.

## 12. Decision checklist before implementation

Lock these before schema migration:

- [ ] MVP object vocabulary
- [ ] Product vs Project naming strategy
- [ ] Solution vs Feature terminology
- [ ] Problem lifecycle
- [ ] Decision lifecycle
- [ ] Relationship catalogue
- [ ] Canonical vs candidate rules
- [ ] Source artifact retention
- [ ] Initial roles and permissions
- [ ] Feature flag and route strategy
- [ ] First demo dataset
- [ ] First external integration hypothesis
