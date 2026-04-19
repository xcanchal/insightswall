import type { ProjectEntity } from '../../../domain/project/project.entity.js';
import type { IProjectRepository } from '../../../domain/project/project.repository.js';

export class UpdateProjectUseCase {
	constructor(private readonly projectRepository: IProjectRepository) {}

	async execute(projectId: string, name: string): Promise<ProjectEntity | null> {
		return this.projectRepository.update(projectId, name);
	}
}
