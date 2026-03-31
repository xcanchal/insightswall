import type { ProjectMember, MemberRole } from '../domain/project-members.ts';
import type { ApiResponse } from './common.ts';

export type GetProjectMembersResponse = ApiResponse<ProjectMember[]>;

export interface AddProjectMemberRequest {
	userId: string;
	role?: MemberRole;
}
export type AddProjectMemberResponse = ApiResponse<ProjectMember>;

export interface UpdateProjectMemberRequest {
	role: MemberRole;
}
export type UpdateProjectMemberResponse = ApiResponse<ProjectMember>;
