export type SuggestionStatus = 'CREATED' | 'REJECTED';

export interface Suggestion {
	id: string;
	projectId: string;
	userId: string;
	title: string;
	description: string;
	status: SuggestionStatus;
	createdAt: string;
}
