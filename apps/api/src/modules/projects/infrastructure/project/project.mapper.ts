import type { InferSelectModel } from 'drizzle-orm';
import { projects } from '../../../../lib/db/schema.js';
import type { ProjectEntity } from '../../domain/project/project.entity.js';

type ProjectRow = InferSelectModel<typeof projects>;

export function toProject(row: ProjectRow): ProjectEntity {
	return {
		id: row.id,
		name: row.name,
		url: row.url,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt,
	};
}
