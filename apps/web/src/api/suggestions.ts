import { apiClient } from '@/lib/api-client';
import type { SuggestionCategory, SuggestionSortBy, SuggestionStatus } from '@app/types';

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
	rejectionReason: string | null;
	createdAt: string;
	updatedAt: string | null;
};

export type SuggestionWithVoteContextResponse = SuggestionResponse & {
	voteCount: number;
	userHasVoted: boolean;
};

export type SuggestionQueryParams = {
	sortBy?: SuggestionSortBy;
	categories?: SuggestionCategory[];
	statuses?: SuggestionStatus[];
	search?: string;
};

export const suggestionsApi = {
	getByProjectId: (projectId: string, params: SuggestionQueryParams = {}) => {
		const query = new URLSearchParams();
		if (params.sortBy) query.set('sortBy', params.sortBy);
		if (params.search) query.set('search', params.search);
		params.categories?.forEach((c) => query.append('categories', c));
		params.statuses?.forEach((s) => query.append('statuses', s));
		return apiClient.get<SuggestionWithVoteContextResponse[]>(`/api/projects/${projectId}/suggestions?${query.toString()}`);
	},
	create: (data: CreateSuggestionInput) => apiClient.post<SuggestionResponse>('/api/suggestions', data),
	editSuggestion: (projectId: string, suggestionId: string, description: string, category: SuggestionCategory) =>
		apiClient.patch<SuggestionResponse>(`/api/projects/${projectId}/suggestions/${suggestionId}`, { description, category }),
	updateStatus: (projectId: string, suggestionId: string, status: SuggestionStatus, rejectionReason?: string) =>
		apiClient.patch<SuggestionResponse>(`/api/projects/${projectId}/suggestions/${suggestionId}/status`, { status, rejectionReason }),
	deleteSuggestion: (projectId: string, suggestionId: string) =>
		apiClient.delete<void>(`/api/projects/${projectId}/suggestions/${suggestionId}`),
	vote: (suggestionId: string) => apiClient.post<void>(`/api/suggestions/${suggestionId}/votes`, {}),
	unvote: (suggestionId: string) => apiClient.delete<void>(`/api/suggestions/${suggestionId}/votes`),
};
