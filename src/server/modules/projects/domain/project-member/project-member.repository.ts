import type { ProjectMemberEntity } from './project-member.entity';

export interface IProjectMemberRepository {
	findByUserAndProjectId(userId: string, projectId: string): Promise<ProjectMemberEntity | null>;
}
