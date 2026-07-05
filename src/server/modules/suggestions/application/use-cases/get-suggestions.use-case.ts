import type {
	ISuggestionRepository,
	SuggestionFilters,
	SuggestionSortBy,
	SuggestionWithVoteContext,
} from '../../domain/suggestion.repository';
import type { IProjectRepository } from '../../../projects/domain/project/project.repository';
import { ProjectNotFoundError } from '../../../projects/domain/project/project.errors';

export class GetSuggestionsUseCase {
	private readonly suggestionRepository: ISuggestionRepository;
	private readonly projectRepository: IProjectRepository;

	constructor(suggestionRepository: ISuggestionRepository, projectRepository: IProjectRepository) {
		this.suggestionRepository = suggestionRepository;
		this.projectRepository = projectRepository;
	}

	async execute(
		projectId: string,
		userId: string | null,
		sortBy: SuggestionSortBy,
		filters?: SuggestionFilters
	): Promise<SuggestionWithVoteContext[]> {
		const project = await this.projectRepository.findById(projectId);
		if (!project) throw new ProjectNotFoundError(projectId);

		return this.suggestionRepository.findAllByProjectId(projectId, userId, sortBy, filters);
	}
}
