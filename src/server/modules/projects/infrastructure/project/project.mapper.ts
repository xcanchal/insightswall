import type { InferSelectModel } from 'drizzle-orm';
import { projects } from '../../../../lib/db/schema';
import type { ProjectEntity } from '../../domain/project/project.entity';

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
