import { apiClient } from '@/lib/api-client';
import { MemberRole } from '../../../../packages/types/src/constants';

export type ProjectMemberResponse = {
	projectId: string;
	userId: string;
	role: MemberRole;
	createdAt: string;
	updatedAt: string | null;
};

export const projectMembersApi = {
	getByProjectId: (projectId: string) => apiClient.get<ProjectMemberResponse>(`/api/projects/${projectId}/members`),
};
