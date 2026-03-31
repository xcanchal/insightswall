export type MemberRole = 'USER' | 'ADMIN';

export interface ProjectMember {
	projectId: string;
	userId: string;
	role: MemberRole;
	createdAt: string;
}
