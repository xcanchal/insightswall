import type { ISuggestionRepository } from '../../domain/suggestion.repository.js';
import { AlreadyVotedError } from '../../domain/suggestion.errors.js';

export class VoteSuggestionUseCase {
	private readonly suggestionRepository: ISuggestionRepository;

	constructor(suggestionRepository: ISuggestionRepository) {
		this.suggestionRepository = suggestionRepository;
	}

	async execute(suggestionId: string, userId: string): Promise<void> {
		const alreadyVoted = await this.suggestionRepository.hasVoted(suggestionId, userId);
		if (alreadyVoted) throw new AlreadyVotedError();
		await this.suggestionRepository.vote(suggestionId, userId);
	}
}
