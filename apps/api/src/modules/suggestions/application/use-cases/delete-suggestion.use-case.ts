import type { IProjectMemberRepository } from '../../../projects/domain/project-member/project-member.repository.js';
import { NotOwnerOrAdminError } from '../../domain/suggestion.errors.js';
import type { ISuggestionRepository } from '../../domain/suggestion.repository.js';

export class DeleteSuggestionUseCase {
	constructor(
		private readonly suggestionRepository: ISuggestionRepository,
		private readonly projectMemberRepository: IProjectMemberRepository
	) {}

	async execute(suggestionId: string, userId: string): Promise<void> {
		const suggestion = await this.suggestionRepository.findById(suggestionId);
		if (!suggestion) return;

		const isOwner = suggestion.userId === userId;
		if (!isOwner) {
			const member = await this.projectMemberRepository.findByUserAndProjectId(userId, suggestion.projectId);
			const isAdmin = member?.role === 'ADMIN';
			if (!isAdmin) throw new NotOwnerOrAdminError();
		}

		return this.suggestionRepository.delete(suggestionId);
	}
}
