import type { SuggestionEntity } from '../../domain/suggestion.entity.js';
import type { ISuggestionRepository } from '../../domain/suggestion.repository.js';

export class GetSuggestionsUseCase {
	private readonly suggestionRepository: ISuggestionRepository;

	constructor(suggestionRepository: ISuggestionRepository) {
		this.suggestionRepository = suggestionRepository;
	}

	async execute(projectId: string): Promise<SuggestionEntity[]> {
		return this.suggestionRepository.findAllByProjectId(projectId);
	}
}
