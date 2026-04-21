import { useQuery } from '@tanstack/react-query';
import { projectMembersApi } from '@/api/project-members';
import { useSession } from '@/lib/auth-client';

export const projectMembersKeys = {
	all: ['project-members'] as const,
	byProjectId: (projectId: string) => [...projectMembersKeys.all, projectId] as const,
};

export function useProjectMe(projectId: string | null | undefined) {
	const { data: session } = useSession();
	return useQuery({
		queryKey: projectMembersKeys.byProjectId(projectId ?? ''),
		queryFn: () => projectMembersApi.getMe(projectId!),
		enabled: !!projectId && !!session?.user,
	});
}
