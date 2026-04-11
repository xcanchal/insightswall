import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { AuthVariables } from '../../../../../lib/auth.js';
import { authMiddleware } from '../../../../../lib/middlewares/auth.middleware.js';
import { GetProjectMemberUseCase } from '../../../application/use-cases/project-member/get-project-member.use-case.js';
import { projectMemberSchema } from './project-member.schemas.js';

const path = '/api/projects/:projectId/members' as const;

const getProjectMemberRouteDefinition = createRoute({
	method: 'get',
	path,
	request: {
		params: z.object({ projectId: z.uuid() }),
	},
	responses: {
		200: {
			content: { 'application/json': { schema: projectMemberSchema } },
			description: 'Project member',
		},
		404: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Project member not found' },
		500: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Internal server error' },
	},
});

export class GetProjectMemberRoute {
	private app: OpenAPIHono<{ Variables: AuthVariables }>;
	private getProjectMemberUseCase: GetProjectMemberUseCase;
	readonly routePath = path;

	constructor(app: OpenAPIHono<{ Variables: AuthVariables }>, getProjectMemberUseCase: GetProjectMemberUseCase) {
		this.app = app;
		this.getProjectMemberUseCase = getProjectMemberUseCase;
	}

	route() {
		this.app.use(this.routePath, authMiddleware);
		this.app.openapi(getProjectMemberRouteDefinition, async (c) => {
			try {
				const { projectId } = c.req.valid('param');
				const user = c.var.user!;
				const projectMember = await this.getProjectMemberUseCase.execute(user.id, projectId);
				if (!projectMember) return c.json({ error: 'Project member not found' }, 404);
				return c.json(
					{
						...projectMember,
						createdAt: projectMember.createdAt.toISOString(),
						updatedAt: projectMember.updatedAt?.toISOString() ?? null,
					},
					200
				);
			} catch (error) {
				console.error(error);
				return c.json({ error: 'Internal server error' }, 500);
			}
		});

		return this.app;
	}
}
