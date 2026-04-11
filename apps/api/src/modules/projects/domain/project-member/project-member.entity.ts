import { MemberRole } from '@app/types';

export interface ProjectMemberEntity {
	projectId: string;
	userId: string;
	role: MemberRole;
	createdAt: Date;
	updatedAt: Date | null;
}
