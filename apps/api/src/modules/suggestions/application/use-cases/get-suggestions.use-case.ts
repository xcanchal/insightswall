import type { ISuggestionRepository, SuggestionWithVoteContext } from '../../domain/suggestion.repository.js';

export class GetSuggestionsUseCase {
	private readonly suggestionRepository: ISuggestionRepository;

	constructor(suggestionRepository: ISuggestionRepository) {
		this.suggestionRepository = suggestionRepository;
	}

	async execute(projectId: string, userId: string | null): Promise<SuggestionWithVoteContext[]> {
		return this.suggestionRepository.findAllByProjectId(projectId, userId);
	}
}
