export const PRODUCT_OBJECT_KINDS = ['PROBLEM', 'EVIDENCE', 'DECISION', 'SOLUTION', 'OUTCOME'] as const;
export type ProductObjectKind = (typeof PRODUCT_OBJECT_KINDS)[number];

export const PROBLEM_STATUSES = ['EMERGING', 'VALIDATED', 'ARCHIVED'] as const;
export const EVIDENCE_STATUSES = ['ACTIVE', 'ARCHIVED'] as const;
export const DECISION_STATUSES = ['PROPOSED', 'ACCEPTED', 'REJECTED', 'SUPERSEDED'] as const;
export const SOLUTION_STATUSES = ['PROPOSED', 'IN_PROGRESS', 'SHIPPED', 'ABANDONED'] as const;
export const OUTCOME_STATUSES = ['RECORDED'] as const;

export type ProblemStatus = (typeof PROBLEM_STATUSES)[number];
export type EvidenceStatus = (typeof EVIDENCE_STATUSES)[number];
export type DecisionStatus = (typeof DECISION_STATUSES)[number];
export type SolutionStatus = (typeof SOLUTION_STATUSES)[number];
export type OutcomeStatus = (typeof OUTCOME_STATUSES)[number];

export const PRODUCT_OBJECT_STATUSES = [
	...PROBLEM_STATUSES,
	...EVIDENCE_STATUSES,
	...DECISION_STATUSES,
	...SOLUTION_STATUSES,
	...OUTCOME_STATUSES,
] as const;
export type ProductObjectStatus = (typeof PRODUCT_OBJECT_STATUSES)[number];

export const OBJECT_RELATIONSHIP_TYPES = ['SUPPORTS', 'LED_TO', 'SELECTS', 'ADDRESSES', 'MEASURED_BY', 'SUPERSEDES'] as const;
export type ObjectRelationshipType = (typeof OBJECT_RELATIONSHIP_TYPES)[number];

export const PRODUCT_OBJECT_ORIGINS = ['MANUAL', 'SYSTEM'] as const;
export type ProductObjectOrigin = (typeof PRODUCT_OBJECT_ORIGINS)[number];
