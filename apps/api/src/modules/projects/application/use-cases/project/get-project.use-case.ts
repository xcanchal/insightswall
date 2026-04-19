import type { ProjectEntity } from '../../../domain/project/project.entity.js';
import type { IProjectRepository } from '../../../domain/project/project.repository.js';

export class GetProjectUseCase {
	private readonly projectRepository: IProjectRepository;

	constructor(projectRepository: IProjectRepository) {
		this.projectRepository = projectRepository;
	}

	async execute(id: string): Promise<ProjectEntity | null> {
		return this.projectRepository.findById(id);
	}
}
