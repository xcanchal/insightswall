import { NotSuggestionOwnerError } from '../../domain/suggestion.errors.js';
import type { SuggestionCategory, SuggestionEntity } from '../../domain/suggestion.entity.js';
import type { ISuggestionRepository } from '../../domain/suggestion.repository.js';

export class EditSuggestionUseCase {
	constructor(private readonly suggestionRepository: ISuggestionRepository) {}

	async execute(suggestionId: string, userId: string, description: string, category: SuggestionCategory): Promise<SuggestionEntity | null> {
		const suggestion = await this.suggestionRepository.findById(suggestionId);
		if (!suggestion) return null;

		if (suggestion.userId !== userId) throw new NotSuggestionOwnerError();

		return this.suggestionRepository.update(suggestionId, description, category);
	}
}
