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
	createdAt: string;
	updatedAt: string | null;
	// TODO: join with votes table
	votes: number;
};

export const suggestionsApi = {
	getByProjectId: (projectId: string) => apiClient.get<SuggestionResponse[]>(`/api/projects/${projectId}/suggestions`),
	create: (data: CreateSuggestionInput) => apiClient.post<SuggestionResponse>('/api/suggestions', data),
};
