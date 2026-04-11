import type { InferSelectModel } from 'drizzle-orm';
import { projectMembers } from '../../../../lib/db/schema.js';
import type { ProjectMemberEntity } from '../../domain/project-member/project-member.entity.js';

type ProjectMemberRow = InferSelectModel<typeof projectMembers>;

export function toProjectMember(row: ProjectMemberRow): ProjectMemberEntity {
	return {
		projectId: row.projectId,
		userId: row.userId,
		role: row.role,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt ?? null,
	};
}
