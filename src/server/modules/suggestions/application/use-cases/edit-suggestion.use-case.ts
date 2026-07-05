import { NotSuggestionOwnerError } from '../../domain/suggestion.errors';
import type { SuggestionCategory, SuggestionEntity } from '../../domain/suggestion.entity';
import type { ISuggestionRepository } from '../../domain/suggestion.repository';

export class EditSuggestionUseCase {
	constructor(private readonly suggestionRepository: ISuggestionRepository) {}

	async execute(suggestionId: string, userId: string, description: string, category: SuggestionCategory): Promise<SuggestionEntity | null> {
		const suggestion = await this.suggestionRepository.findById(suggestionId);
		if (!suggestion) return null;

		if (suggestion.userId !== userId) throw new NotSuggestionOwnerError();

		return this.suggestionRepository.update(suggestionId, description, category);
	}
}
