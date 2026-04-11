import type { SuggestionCategory, SuggestionEntity } from '../../domain/suggestion.entity.js';
import type { ISuggestionRepository } from '../../domain/suggestion.repository.js';

export class CreateSuggestionUseCase {
	private readonly suggestionRepository: ISuggestionRepository;

	constructor(suggestionRepository: ISuggestionRepository) {
		this.suggestionRepository = suggestionRepository;
	}

	async execute(projectId: string, userId: string, description: string, category: SuggestionCategory): Promise<SuggestionEntity> {
		const suggestion = await this.suggestionRepository.create(projectId, userId, description, category);
		return suggestion;
	}
}
