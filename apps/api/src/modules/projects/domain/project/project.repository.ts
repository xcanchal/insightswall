import type { ProjectEntity } from './project.entity.js';

export interface IProjectRepository {
	create(name: string, url: string | null, userId: string): Promise<ProjectEntity>;
	findById(id: string): Promise<ProjectEntity | null>;
	findAllByUserId(userId: string): Promise<ProjectEntity[]>;
	update(id: string, name: string, url?: string | null): Promise<ProjectEntity | null>;
	delete(id: string): Promise<void>;
}
