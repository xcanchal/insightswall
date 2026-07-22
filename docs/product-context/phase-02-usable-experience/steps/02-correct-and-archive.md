# Phase 2 Step 02 — Correct mistakes and archive context

Status: Blocked by Phase 2 Step 01  
Owner: Unassigned

## Outcome

An admin can correct canonical context, remove an incorrect relationship, and archive obsolete records without erasing provenance or Decision history.

## Read

- Phase 1 command/history contracts
- Current complete Problem page
- Accepted Evidence and archive decisions

## Scope

- Add the smallest edit commands/forms needed for Problem, Decision, Solution, and Outcome corrections.
- Preserve Evidence original content; allow correction of permitted metadata/annotation fields only.
- Version meaningful Decision edits.
- Add unlink and archive commands with activity.
- Hide archived objects from normal lists/context/search and show a clear archived state on authorized direct access if supported.
- Add authorization, rollback, history, and UI tests.

## Do not add

Bulk operations, restore UI unless a real correction requires it, Problem merge, approval workflows, fine-grained field permissions, or hard-delete UI.

## Acceptance

- [ ] Common mistakes can be corrected without database access.
- [ ] Evidence original content cannot be silently rewritten.
- [ ] Decision edit history remains inspectable.
- [ ] Incorrect links can be removed with activity history.
- [ ] Archive behavior is consistent across lists, context, and search.
- [ ] `USER` remains read-only and cross-Project mutations fail.
