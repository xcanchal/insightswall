import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { authMiddleware } from '../../../../../lib/middlewares/auth.middleware.js';
import { type AuthVariables } from '../../../../../lib/auth.js';
import { GetProjectsUseCase } from '../../../application/use-cases/project/get-projects.use-case.js';
import { projectSchema } from './project.schemas.js';

const path = '/api/projects' as const;

const getProjectsRouteDefinition = createRoute({
	method: 'get',
	path,
	responses: {
		200: { content: { 'application/json': { schema: z.array(projectSchema) } }, description: 'Projects list' },
		401: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Unauthorized' },
		500: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Internal server error' },
	},
});

export class GetProjectsRoute {
	private app: OpenAPIHono<{ Variables: AuthVariables }>;
	private getProjectsUseCase: GetProjectsUseCase;
	readonly routePath = path;

	constructor(app: OpenAPIHono<{ Variables: AuthVariables }>, getProjectsUseCase: GetProjectsUseCase) {
		this.app = app;
		this.getProjectsUseCase = getProjectsUseCase;
	}

	route() {
		this.app.use(this.routePath, authMiddleware);
		this.app.openapi(getProjectsRouteDefinition, async (c) => {
			try {
				const user = c.var.user!;
				const projectsList = await this.getProjectsUseCase.execute(user.id);
				return c.json(
					projectsList.map((p) => ({
						...p,
						createdAt: p.createdAt.toISOString(),
						updatedAt: p.updatedAt?.toISOString() ?? null,
					})),
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
