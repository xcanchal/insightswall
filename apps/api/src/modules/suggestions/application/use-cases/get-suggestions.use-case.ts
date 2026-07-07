import type {
	ISuggestionRepository,
	SuggestionFilters,
	SuggestionSortBy,
	SuggestionWithVoteContext,
} from '../../domain/suggestion.repository.js';
import type { IProjectRepository } from '../../../projects/domain/project/project.repository.js';
import { ProjectNotFoundError } from '../../../projects/domain/project/project.errors.js';
import type { IProjectMemberRepository } from '../../../projects/domain/project-member/project-member.repository.js';
import { SUGGESTION_STATUSES } from '@app/types';
import type { SuggestionStatus } from '../../domain/suggestion.entity.js';
import { PrivateRoadmapError } from '../../domain/suggestion.errors.js';

const ROADMAP_STATUSES: SuggestionStatus[] = ['PLANNED', 'IN_PROGRESS', 'DONE'];
const PUBLIC_SUGGESTION_STATUSES = SUGGESTION_STATUSES.filter((status) => !ROADMAP_STATUSES.includes(status));

export class GetSuggestionsUseCase {
	private readonly suggestionRepository: ISuggestionRepository;
	private readonly projectRepository: IProjectRepository;
	private readonly projectMemberRepository: IProjectMemberRepository;

	constructor(
		suggestionRepository: ISuggestionRepository,
		projectRepository: IProjectRepository,
		projectMemberRepository: IProjectMemberRepository
	) {
		this.suggestionRepository = suggestionRepository;
		this.projectRepository = projectRepository;
		this.projectMemberRepository = projectMemberRepository;
	}

	async execute(
		projectId: string,
		userId: string | null,
		sortBy: SuggestionSortBy,
		filters?: SuggestionFilters
	): Promise<SuggestionWithVoteContext[]> {
		const project = await this.projectRepository.findById(projectId);
		if (!project) throw new ProjectNotFoundError(projectId);

		const projectMember = userId ? await this.projectMemberRepository.findByUserAndProjectId(userId, projectId) : null;
		const canViewRoadmap = project.isRoadmapPublic || !!projectMember;
		const effectiveFilters = canViewRoadmap ? filters : this.removePrivateRoadmapStatuses(filters);

		return this.suggestionRepository.findAllByProjectId(projectId, userId, sortBy, effectiveFilters);
	}

	private removePrivateRoadmapStatuses(filters?: SuggestionFilters): SuggestionFilters {
		if (!filters?.statuses?.length) {
			return { ...filters, statuses: [...PUBLIC_SUGGESTION_STATUSES] };
		}

		const publicStatuses = filters.statuses.filter((status) => !ROADMAP_STATUSES.includes(status));
		if (publicStatuses.length === 0) throw new PrivateRoadmapError();

		return { ...filters, statuses: publicStatuses };
	}
}
