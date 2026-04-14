import { apiClient } from '@/lib/api-client';
import type { SuggestionCategory, SuggestionStatus } from '@app/types';

export type CreateSuggestionInput = {
	projectId: string;
	description: string;
	category: SuggestionCategory;
};

export type SuggestionResponse = {
	id: string;
	projectId: string;
	userId: string;
	description: string;
	category: SuggestionCategory;
	status: SuggestionStatus;
	voteCount: number;
	userHasVoted: boolean;
	createdAt: string;
	updatedAt: string | null;
};

export type SuggestionSortBy = 'mostVoted' | 'newest';

export type SuggestionQueryParams = {
	sortBy?: SuggestionSortBy;
	categories?: SuggestionCategory[];
	statuses?: SuggestionStatus[];
};

export const suggestionsApi = {
	getByProjectId: (projectId: string, params: SuggestionQueryParams = {}) => {
		const query = new URLSearchParams();
		if (params.sortBy) query.set('sortBy', params.sortBy);
		params.categories?.forEach((c) => query.append('categories', c));
		params.statuses?.forEach((s) => query.append('statuses', s));
		return apiClient.get<SuggestionResponse[]>(`/api/projects/${projectId}/suggestions?${query.toString()}`);
	},
	create: (data: CreateSuggestionInput) => apiClient.post<SuggestionResponse>('/api/suggestions', data),
	vote: (suggestionId: string) => apiClient.post<void>(`/api/suggestions/${suggestionId}/votes`, {}),
	unvote: (suggestionId: string) => apiClient.delete<void>(`/api/suggestions/${suggestionId}/votes`),
};
