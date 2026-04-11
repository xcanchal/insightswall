import { useProjectMemberByProjectId } from './use-project-members';

export const useIsProjectAdmin = (projectId: string | null) => {
	const { data: projectMember } = useProjectMemberByProjectId(projectId ?? null);
	return projectMember?.role === 'ADMIN';
};
