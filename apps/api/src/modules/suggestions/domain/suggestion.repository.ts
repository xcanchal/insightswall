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
}

export interface ISuggestionRepository {
	create(projectId: string, userId: string, description: string, category: SuggestionCategory): Promise<SuggestionEntity>;
	findAllByProjectId(projectId: string, userId: string | null, sortBy: SuggestionSortBy, filters?: SuggestionFilters): Promise<SuggestionWithVoteContext[]>;
	vote(suggestionId: string, userId: string): Promise<void>;
	unvote(suggestionId: string, userId: string): Promise<void>;
}
