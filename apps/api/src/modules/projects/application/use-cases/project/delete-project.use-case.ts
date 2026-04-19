import type { IProjectRepository } from '../../../domain/project/project.repository.js';

export class DeleteProjectUseCase {
	constructor(private readonly projectRepository: IProjectRepository) {}

	async execute(projectId: string): Promise<void> {
		await this.projectRepository.delete(projectId);
	}
}
