import { useQuery } from '@tanstack/react-query';
import { projectMembersApi } from '@/api/project-members';

export const projectMembersKeys = {
	all: ['project-members'] as const,
	byProjectId: (projectId: string) => [...projectMembersKeys.all, projectId] as const,
};

export function useProjectMemberByProjectId(projectId: string | null | undefined) {
	return useQuery({
		queryKey: projectMembersKeys.byProjectId(projectId ?? ''),
		queryFn: () => projectMembersApi.getByProjectId(projectId!),
		enabled: !!projectId,
	});
}
