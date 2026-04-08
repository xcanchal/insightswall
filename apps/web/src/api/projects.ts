import { apiClient } from '@/lib/api-client';

export type CreateProjectInput = { name: string; slug: string };
export type ProjectResponse = {
	id: string;
	name: string;
	slug: string;
	createdAt: string;
	updatedAt: string | null;
};

export const projectsApi = {
	getAll: () => apiClient.get<ProjectResponse[]>('/api/projects'),
	create: (data: CreateProjectInput) => apiClient.post<ProjectResponse>('/api/projects', data),
};
