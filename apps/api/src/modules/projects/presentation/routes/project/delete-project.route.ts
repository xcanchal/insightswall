import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { authMiddleware } from '../../../../../lib/middlewares/auth.middleware.js';
import { createProjectAdminMiddleware } from '../../../../../lib/middlewares/project-admin.middleware.js';
import { type AuthVariables } from '../../../../../lib/auth.js';
import { DeleteProjectUseCase } from '../../../application/use-cases/project/delete-project.use-case.js';
import type { IProjectMemberRepository } from '../../../domain/project-member/project-member.repository.js';

const path = '/api/projects/:projectId' as const;

const deleteProjectRouteDefinition = createRoute({
	method: 'delete',
	path,
	request: {
		params: z.object({ projectId: z.uuid() }),
	},
	responses: {
		204: { description: 'Project deleted' },
		401: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Unauthorized' },
		403: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Forbidden' },
		500: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Internal server error' },
	},
});

export class DeleteProjectRoute {
	private app: OpenAPIHono<{ Variables: AuthVariables }>;
	private deleteProjectUseCase: DeleteProjectUseCase;
	private projectMemberRepository: IProjectMemberRepository;
	readonly routePath = path;

	constructor(
		app: OpenAPIHono<{ Variables: AuthVariables }>,
		deleteProjectUseCase: DeleteProjectUseCase,
		projectMemberRepository: IProjectMemberRepository
	) {
		this.app = app;
		this.deleteProjectUseCase = deleteProjectUseCase;
		this.projectMemberRepository = projectMemberRepository;
	}

	route() {
		this.app.use(this.routePath, authMiddleware);
		this.app.use(this.routePath, createProjectAdminMiddleware(this.projectMemberRepository));
		this.app.openapi(deleteProjectRouteDefinition, async (c) => {
			try {
				const { projectId } = c.req.valid('param');
				await this.deleteProjectUseCase.execute(projectId);
				return c.body(null, 204);
			} catch (error) {
				console.error(error);
				return c.json({ error: 'Internal server error' }, 500);
			}
		});
		return this.app;
	}
}
