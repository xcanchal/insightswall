import type { ISuggestionRepository } from '../../domain/suggestion.repository.js';

export class DeleteSuggestionUseCase {
	constructor(private readonly suggestionRepository: ISuggestionRepository) {}

	async execute(suggestionId: string): Promise<void> {
		return this.suggestionRepository.delete(suggestionId);
	}
}
