import type { ProjectEntity } from '../../domain/project.entity.js';
import type { IProjectRepository } from '../../domain/project.repository.js';

export class CreateProjectUseCase {
	private readonly projectRepository: IProjectRepository;

	constructor(projectRepository: IProjectRepository) {
		this.projectRepository = projectRepository;
	}

	async execute(name: string, slug: string, userId: string): Promise<ProjectEntity> {
		const slugTaken = await this.projectRepository.existsBySlug(slug);
		if (slugTaken) throw new Error('SLUG_TAKEN');
		return this.projectRepository.create(name, slug, userId);
	}
}
