import { eq } from 'drizzle-orm';
import { inArray } from 'drizzle-orm';
import { db as dbInstance } from '../../../lib/db/index.js';
import type { IProjectRepository } from '../domain/project.repository.js';
import { projects, projectMembers } from '../../../lib/db/schema.js';
import { toProject } from './project.mapper.js';
import type { ProjectEntity } from '../domain/project.entity.js';

export class ProjectRepository implements IProjectRepository {
	private db: typeof dbInstance;

	constructor(db: typeof dbInstance) {
		this.db = db;
	}

	async create(name: string, slug: string, userId: string): Promise<ProjectEntity> {
		return this.db.transaction(async (tx) => {
			const [project] = await tx.insert(projects).values({ name, slug }).returning();
			await tx.insert(projectMembers).values({ projectId: project.id, userId, role: 'ADMIN' });
			return toProject(project);
		});
	}

	async existsBySlug(slug: string): Promise<boolean> {
		const row = await this.db.query.projects.findFirst({ where: eq(projects.slug, slug) });
		return !!row;
	}

	async findAllByUserId(userId: string): Promise<ProjectEntity[]> {
		const memberships = await this.db
			.select({ projectId: projectMembers.projectId })
			.from(projectMembers)
			.where(eq(projectMembers.userId, userId));

		if (memberships.length === 0) return [];

		const projectIds = memberships.map((m) => m.projectId);
		const rows = await this.db.select().from(projects).where(inArray(projects.id, projectIds));
		return rows.map(toProject);
	}
}
