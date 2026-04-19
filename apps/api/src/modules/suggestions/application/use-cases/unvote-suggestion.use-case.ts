import type { ISuggestionRepository } from '../../domain/suggestion.repository.js';

export class UnvoteSuggestionUseCase {
	private readonly suggestionRepository: ISuggestionRepository;

	constructor(suggestionRepository: ISuggestionRepository) {
		this.suggestionRepository = suggestionRepository;
	}

	async execute(suggestionId: string, userId: string): Promise<void> {
		await this.suggestionRepository.unvote(suggestionId, userId);
	}
}
