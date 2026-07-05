import { apiClient } from '@/lib/api-client';
import { MemberRole } from '@/shared/constants';

export type ProjectMemberResponse = {
	projectId: string;
	userId: string;
	role: MemberRole;
	createdAt: string;
	updatedAt: string | null;
};

export const projectMembersApi = {
	getMe: (projectId: string) => apiClient.get<ProjectMemberResponse>(`/api/projects/${projectId}/me`),
};
