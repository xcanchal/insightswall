# Lean Phase 1 decisions

Status: Accepted on 2026-07-22

| Decision         | Default                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------- |
| Boundary         | Existing `projects.id`; no Workspace or duplicate Product table                                                   |
| Product creation | Reuse existing Project creation/listing                                                                           |
| Read permission  | Authenticated Project member                                                                                      |
| Write permission | Project `ADMIN`                                                                                                   |
| Rollout          | No runtime flags or activation columns                                                                            |
| Routes           | Private Product Context routes under `/products/:projectId`; API under `/api/product-context/projects/:projectId` |
| Canonical model  | New Product Context tables; Suggestions remain legacy source data                                                 |
| Evidence edits   | Preserve original content; later corrections create explicit annotations or versions                              |
| Supersession     | `DECISION --SUPERSEDES--> DECISION` plus version/activity history                                                 |
| Archive          | Canonical objects archive; do not add hard-delete UI                                                              |
| Search           | Case-insensitive Project-scoped match over canonical title/summary                                                |
| Roles            | No new roles in Phase 1                                                                                           |
| Async work       | None; mutations and activity are synchronous transactions                                                         |
| Testing          | PGlite API integration + current mocked Playwright style; no new full-stack harness initially                     |

Changed decisions must include their immediate schema/code consequence. Later-phase preferences do not belong here.
