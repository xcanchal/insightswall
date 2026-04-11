import type { ProjectMemberEntity } from '../../../domain/project-member/project-member.entity.js';
import type { IProjectMemberRepository } from '../../../domain/project-member/project-member.repository.js';

export class GetProjectMemberUseCase {
	private readonly projectMemberRepository: IProjectMemberRepository;

	constructor(projectMemberRepository: IProjectMemberRepository) {
		this.projectMemberRepository = projectMemberRepository;
	}

	async execute(userId: string, projectId: string): Promise<ProjectMemberEntity | null> {
		return this.projectMemberRepository.findByUserAndProjectId(userId, projectId);
	}
}
