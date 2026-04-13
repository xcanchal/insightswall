import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { optionalAuthMiddleware } from '../../../../../lib/middlewares/optional-auth.middleware.js';
import { type AuthVariables } from '../../../../../lib/auth.js';
import { GetProjectUseCase } from '../../../application/use-cases/project/get-project.use-case.js';
import { projectSchema } from './project.schemas.js';

const path = '/api/projects/:projectId' as const;

const getProjectRouteDefinition = createRoute({
	method: 'get',
	path,
	request: {
		params: z.object({ projectId: z.uuid() }),
	},
	responses: {
		200: { content: { 'application/json': { schema: projectSchema } }, description: 'Project' },
		404: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Project not found' },
		500: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Internal server error' },
	},
});

export class GetProjectRoute {
	private app: OpenAPIHono<{ Variables: AuthVariables }>;
	private getProjectUseCase: GetProjectUseCase;
	readonly routePath = path;

	constructor(app: OpenAPIHono<{ Variables: AuthVariables }>, getProjectUseCase: GetProjectUseCase) {
		this.app = app;
		this.getProjectUseCase = getProjectUseCase;
	}

	route() {
		this.app.use(this.routePath, optionalAuthMiddleware);
		this.app.openapi(getProjectRouteDefinition, async (c) => {
			try {
				const { projectId } = c.req.valid('param');
				const project = await this.getProjectUseCase.execute(projectId);
				if (!project) return c.json({ error: 'Project not found' }, 404);
				return c.json({ ...project, createdAt: project.createdAt.toISOString(), updatedAt: project.updatedAt?.toISOString() ?? null }, 200);
			} catch (error) {
				console.error(error);
				return c.json({ error: 'Internal server error' }, 500);
			}
		});

		return this.app;
	}
}
