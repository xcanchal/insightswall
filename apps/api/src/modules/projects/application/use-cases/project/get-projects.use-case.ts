import type { ProjectEntity } from '../../../domain/project/project.entity.js';
import type { IProjectRepository } from '../../../domain/project/project.repository.js';

export class GetProjectsUseCase {
	private readonly projectRepository: IProjectRepository;

	constructor(projectRepository: IProjectRepository) {
		this.projectRepository = projectRepository;
	}

	async execute(userId: string): Promise<ProjectEntity[]> {
		return this.projectRepository.findAllByUserId(userId);
	}
}
