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

export const suggestionsApi = {
	getByProjectId: (projectId: string) => apiClient.get<SuggestionResponse[]>(`/api/projects/${projectId}/suggestions`),
	create: (data: CreateSuggestionInput) => apiClient.post<SuggestionResponse>('/api/suggestions', data),
	vote: (suggestionId: string) => apiClient.post<void>(`/api/suggestions/${suggestionId}/votes`, {}),
	unvote: (suggestionId: string) => apiClient.delete<void>(`/api/suggestions/${suggestionId}/votes`),
};
