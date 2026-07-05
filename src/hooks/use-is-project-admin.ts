import { useProjectMe } from './use-project-members';

export const useIsProjectAdmin = (projectId: string | null) => {
	const { data: projectMember } = useProjectMe(projectId ?? null);
	return projectMember?.role === 'ADMIN';
};
