import type { SuggestionCategory, SuggestionEntity, SuggestionStatus } from './suggestion.entity.js';

export interface SuggestionWithVoteContext {
	suggestion: SuggestionEntity;
	voteCount: number;
	userHasVoted: boolean;
}

export type SuggestionSortBy = 'mostVoted' | 'newest';

export interface SuggestionFilters {
	categories?: SuggestionCategory[];
	statuses?: SuggestionStatus[];
	search?: string;
}

export interface ISuggestionRepository {
	create(projectId: string, userId: string, description: string, category: SuggestionCategory): Promise<SuggestionEntity>;
	findAllByProjectId(
		projectId: string,
		userId: string | null,
		sortBy: SuggestionSortBy,
		filters?: SuggestionFilters
	): Promise<SuggestionWithVoteContext[]>;
	updateStatus(suggestionId: string, status: SuggestionStatus, rejectionReason?: string): Promise<SuggestionEntity | null>;
	delete(suggestionId: string): Promise<void>;
	vote(suggestionId: string, userId: string): Promise<void>;
	unvote(suggestionId: string, userId: string): Promise<void>;
}
