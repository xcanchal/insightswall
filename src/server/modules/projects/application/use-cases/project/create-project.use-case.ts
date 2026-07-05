import type { ProjectEntity } from '../../../domain/project/project.entity';
import type { IProjectRepository } from '../../../domain/project/project.repository';

export class CreateProjectUseCase {
	private readonly projectRepository: IProjectRepository;

	constructor(projectRepository: IProjectRepository) {
		this.projectRepository = projectRepository;
	}

	async execute(name: string, url: string | null, userId: string): Promise<ProjectEntity> {
		return this.projectRepository.create(name, url, userId);
	}
}
