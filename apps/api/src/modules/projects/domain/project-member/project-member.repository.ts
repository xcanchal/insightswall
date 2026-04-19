import type { ProjectMemberEntity } from './project-member.entity.js';

export interface IProjectMemberRepository {
	findByUserAndProjectId(userId: string, projectId: string): Promise<ProjectMemberEntity | null>;
}
