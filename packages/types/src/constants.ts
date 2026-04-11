export const MEMBER_ROLES = ['USER', 'ADMIN'] as const;
export const SUGGESTION_CATEGORIES = ['FEATURE', 'BUG'] as const;
export const SUGGESTION_STATUSES = ['OPEN', 'PLANNED', 'IN_PROGRESS', 'DONE', 'REJECTED'] as const;
export const NOTIFICATION_TYPES = [
	'SUGGESTION_CREATED',
	'SUGGESTION_REJECTED',
	'SUGGESTION_COMMENT',
	'SUGGESTION_PLANNED',
	'SUGGESTION_STATUS_CHANGED',
] as const;

export type MemberRole = (typeof MEMBER_ROLES)[number];
export type SuggestionCategory = (typeof SUGGESTION_CATEGORIES)[number];
export type SuggestionStatus = (typeof SUGGESTION_STATUSES)[number];
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];
