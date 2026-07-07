import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectsApi, type ProjectResponse, type UpdateProjectInput } from '@/api/projects';

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

export function useUpdateProject() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ projectId, data }: { projectId: string; data: UpdateProjectInput }) => projectsApi.update(projectId, data),
		onSuccess: (project: ProjectResponse) => {
			queryClient.setQueryData(projectsKeys.byId(project.id), project);
			queryClient.invalidateQueries({ queryKey: projectsKeys.all, exact: true });
		},
	});
}

export function useDeleteProject() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (projectId: string) => projectsApi.delete(projectId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: projectsKeys.all });
		},
	});
}

export function useProjectById(projectId: string | null | undefined) {
	return useQuery({
		queryKey: projectsKeys.byId(projectId ?? ''),
		queryFn: () => projectsApi.getById(projectId!),
		enabled: !!projectId,
	});
}
