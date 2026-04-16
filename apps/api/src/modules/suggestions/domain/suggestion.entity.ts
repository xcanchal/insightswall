import { SUGGESTION_CATEGORIES, SUGGESTION_STATUSES } from '@app/types';

export type SuggestionStatus = (typeof SUGGESTION_STATUSES)[number];
export type SuggestionCategory = (typeof SUGGESTION_CATEGORIES)[number];

export interface SuggestionEntity {
	id: string;
	projectId: string;
	userId: string;
	description: string;
	category: SuggestionCategory;
	status: SuggestionStatus;
	rejectionReason: string | null;
	createdAt: Date;
	updatedAt: Date | null;
}
