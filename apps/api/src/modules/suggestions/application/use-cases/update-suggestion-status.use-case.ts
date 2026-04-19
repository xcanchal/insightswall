import type { SuggestionEntity, SuggestionStatus } from '../../domain/suggestion.entity.js';
import type { ISuggestionRepository } from '../../domain/suggestion.repository.js';

export class UpdateSuggestionStatusUseCase {
	constructor(private readonly suggestionRepository: ISuggestionRepository) {}

	async execute(suggestionId: string, status: SuggestionStatus, rejectionReason?: string): Promise<SuggestionEntity | null> {
		return this.suggestionRepository.updateStatus(suggestionId, status, rejectionReason);
	}
}
