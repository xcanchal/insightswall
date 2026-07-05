import type { SuggestionCategory, SuggestionEntity } from '../../domain/suggestion.entity';
import type { ISuggestionRepository } from '../../domain/suggestion.repository';
import type { IProjectRepository } from '../../../projects/domain/project/project.repository';
import { ProjectNotFoundError } from '../../../projects/domain/project/project.errors';

export class CreateSuggestionUseCase {
	private readonly suggestionRepository: ISuggestionRepository;
	private readonly projectRepository: IProjectRepository;

	constructor(suggestionRepository: ISuggestionRepository, projectRepository: IProjectRepository) {
		this.suggestionRepository = suggestionRepository;
		this.projectRepository = projectRepository;
	}

	async execute(projectId: string, userId: string, description: string, category: SuggestionCategory): Promise<SuggestionEntity> {
		const project = await this.projectRepository.findById(projectId);

		if (!project) throw new ProjectNotFoundError(projectId);

		return this.suggestionRepository.create(projectId, userId, description, category);
	}
}
