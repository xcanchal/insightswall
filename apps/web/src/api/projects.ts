import { apiClient } from '@/lib/api-client';

export type CreateProjectInput = { name: string; url?: string | null };
export type ProjectResponse = {
	id: string;
	name: string;
	url: string | null;
	createdAt: string;
	updatedAt: string | null;
};

export const projectsApi = {
	getAll: () => apiClient.get<ProjectResponse[]>('/api/projects'),
	create: (data: CreateProjectInput) => apiClient.post<ProjectResponse>('/api/projects', data),
	getById: (projectId: string) => apiClient.get<ProjectResponse>(`/api/projects/${projectId}`),
};
