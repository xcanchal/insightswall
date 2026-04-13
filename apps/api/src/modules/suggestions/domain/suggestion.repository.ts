import type { SuggestionCategory, SuggestionEntity } from './suggestion.entity.js';

export interface SuggestionWithVoteContext {
	suggestion: SuggestionEntity;
	voteCount: number;
	userHasVoted: boolean;
}

export interface ISuggestionRepository {
	create(projectId: string, userId: string, description: string, category: SuggestionCategory): Promise<SuggestionEntity>;
	findAllByProjectId(projectId: string, userId: string | null): Promise<SuggestionWithVoteContext[]>;
	vote(suggestionId: string, userId: string): Promise<void>;
	unvote(suggestionId: string, userId: string): Promise<void>;
}
