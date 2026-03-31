import type { Suggestion, SuggestionStatus } from '../domain/suggestions.ts';
import type { ApiResponse, PaginatedResponse } from './common.ts';

export interface GetSuggestionsQuery {
	status?: SuggestionStatus;
	page?: number;
	perPage?: number;
	search?: string;
}
export type GetSuggestionsResponse = PaginatedResponse<Suggestion>;
export type GetSuggestionResponse = ApiResponse<Suggestion>;

export interface CreateSuggestionRequest {
	title: string;
	description?: string;
}
export type CreateSuggestionResponse = ApiResponse<Suggestion>;
