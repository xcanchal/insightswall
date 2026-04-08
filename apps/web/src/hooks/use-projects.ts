import { useMutation, useQuery } from '@tanstack/react-query';
import { projectsApi } from '@/api/projects';

export const projectsKeys = {
	all: ['projects'] as const,
};

export function useProjects() {
	return useQuery({ queryKey: projectsKeys.all, queryFn: projectsApi.getAll });
}

export function useCreateProject() {
	return useMutation({ mutationFn: projectsApi.create });
}
