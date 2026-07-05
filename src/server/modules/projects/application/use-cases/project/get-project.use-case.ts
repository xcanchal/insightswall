import type { ProjectEntity } from '../../../domain/project/project.entity';
import type { IProjectRepository } from '../../../domain/project/project.repository';

export class GetProjectUseCase {
	private readonly projectRepository: IProjectRepository;

	constructor(projectRepository: IProjectRepository) {
		this.projectRepository = projectRepository;
	}

	async execute(id: string): Promise<ProjectEntity | null> {
		return this.projectRepository.findById(id);
	}
}
