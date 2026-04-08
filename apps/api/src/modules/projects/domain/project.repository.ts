import type { ProjectEntity } from './project.entity.js';

export interface IProjectRepository {
	create(name: string, slug: string, userId: string): Promise<ProjectEntity>;
	existsBySlug(slug: string): Promise<boolean>;
	findAllByUserId(userId: string): Promise<ProjectEntity[]>;
}
