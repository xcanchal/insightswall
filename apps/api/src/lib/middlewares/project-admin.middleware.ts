import { createMiddleware } from 'hono/factory';
import type { AuthVariables } from '../auth.js';
import type { IProjectMemberRepository } from '../../modules/projects/domain/project-member/project-member.repository.js';

export const createProjectAdminMiddleware = (projectMemberRepository: IProjectMemberRepository) =>
	createMiddleware<{ Variables: AuthVariables }>(async (c, next) => {
		const user = c.var.user;
		const projectId = c.req.param('projectId');

		if (!user || !projectId) {
			return c.json({ error: 'Unauthorized' }, 401);
		}

		const member = await projectMemberRepository.findByUserAndProjectId(user.id, projectId);
		if (!member || member.role !== 'ADMIN') {
			return c.json({ error: 'Forbidden' }, 403);
		}

		await next();
	});
