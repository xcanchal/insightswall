import { projectMembers } from '../../../../lib/db/schema.js';
import type { IProjectMemberRepository } from '../../domain/project-member/project-member.repository.js';
import { db as dbInstance } from '../../../../lib/db/index.js';
import type { ProjectMemberEntity } from '../../domain/project-member/project-member.entity.js';
import { toProjectMember } from './project-member.mapper.js';
import { eq, and } from 'drizzle-orm';

export class ProjectMemberRepository implements IProjectMemberRepository {
	private db: typeof dbInstance;

	constructor(db: typeof dbInstance) {
		this.db = db;
	}

	async findByUserAndProjectId(userId: string, projectId: string): Promise<ProjectMemberEntity | null> {
		const row = await this.db.query.projectMembers.findFirst({
			where: and(eq(projectMembers.userId, userId), eq(projectMembers.projectId, projectId)),
		});
		return row ? toProjectMember(row) : null;
	}
}
