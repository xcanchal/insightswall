# Phase 3 — MVP release and validation

Status: Blocked by Phase 2

## Goal

Release the usable Product Context workflow safely to the owner and a tiny set of trusted users, then decide from actual behavior whether it is valuable.

## Steps

| Step                                                    | State   | Result                                                                     |
| ------------------------------------------------------- | ------- | -------------------------------------------------------------------------- |
| [01 Release readiness](./steps/01-release-readiness.md) | Blocked | Migration, security, data safety, regressions, and operations are credible |
| [02 Private MVP pilot](./steps/02-private-pilot.md)     | Blocked | Real usage produces a Continue/Narrow/Revise/Stop decision                 |

## MVP release gate

The product is releasable after Step 01 when:

- the complete UI workflow works on production-like PostgreSQL;
- private authorization and Project isolation are tested;
- migrations and backup/restore expectations are understood;
- critical errors have recoverable behavior;
- legacy application regressions pass;
- documentation matches the deployed system.

Step 02 establishes value, not merely technical releaseability.

## Exit criteria

- The MVP is deployed privately.
- The owner and up to a few trusted users attempt real Problem/Decision chains.
- Friction and return behavior are recorded without adding analytics infrastructure.
- Only critical pilot blockers are fixed.
- A written product decision determines what, if anything, becomes the next phase.
