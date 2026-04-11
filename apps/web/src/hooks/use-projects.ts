import { useMutation, useQuery } from '@tanstack/react-query';
import { projectsApi } from '@/api/projects';

export const projectsKeys = {
	all: ['projects'] as const,
	byId: (projectId: string) => [...projectsKeys.all, projectId] as const,
};

export function useProjects() {
	return useQuery({ queryKey: projectsKeys.all, queryFn: projectsApi.getAll });
}

export function useCreateProject() {
	return useMutation({ mutationFn: projectsApi.create });
}

export function useProjectById(projectId: string | null | undefined) {
	return useQuery({
		queryKey: projectsKeys.byId(projectId ?? ''),
		queryFn: () => projectsApi.getById(projectId!),
		enabled: !!projectId,
	});
}
