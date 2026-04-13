import { eq, inArray, sql } from 'drizzle-orm';
import { db as dbInstance } from '../../../../lib/db/index.js';
import type { IProjectRepository } from '../../domain/project/project.repository.js';
import { projects, projectMembers } from '../../../../lib/db/schema.js';
import { toProject } from './project.mapper.js';
import type { ProjectEntity } from '../../domain/project/project.entity.js';

export class ProjectRepository implements IProjectRepository {
	private db: typeof dbInstance;

	constructor(db: typeof dbInstance) {
		this.db = db;
	}

	async create(name: string, url: string | null, userId: string): Promise<ProjectEntity> {
		return this.db.transaction(async (tx) => {
			const [project] = await tx.insert(projects).values({ name, url }).returning();
			await tx.insert(projectMembers).values({ projectId: project.id, userId, role: 'ADMIN' });
			return toProject(project);
		});
	}

	async findById(id: string): Promise<ProjectEntity | null> {
		const row = await this.db.query.projects.findFirst({ where: eq(projects.id, id) });
		return row ? toProject(row) : null;
	}

	async update(id: string, name: string): Promise<ProjectEntity | null> {
		const [row] = await this.db
			.update(projects)
			.set({ name, updatedAt: sql`now()` })
			.where(eq(projects.id, id))
			.returning();
		return row ? toProject(row) : null;
	}

	async delete(id: string): Promise<void> {
		await this.db.delete(projects).where(eq(projects.id, id));
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
