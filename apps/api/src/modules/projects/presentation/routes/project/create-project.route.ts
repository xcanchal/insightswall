import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { authMiddleware } from '../../../../../lib/middlewares/auth.middleware.js';
import { type AuthVariables } from '../../../../../lib/auth.js';
import { CreateProjectUseCase } from '../../../application/use-cases/project/create-project.use-case.js';
import { projectSchema } from './project.schemas.js';

const bodySchema = z.object({
	name: z.string().min(1).max(50),
	url: z.url().nullish(),
});

const path = '/api/projects' as const;

const createProjectRouteDefinition = createRoute({
	method: 'post',
	path,
	request: { body: { content: { 'application/json': { schema: bodySchema } }, required: true } },
	responses: {
		201: { content: { 'application/json': { schema: projectSchema } }, description: 'Project created' },
		500: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Internal server error' },
	},
});

export class CreateProjectRoute {
	private app: OpenAPIHono<{ Variables: AuthVariables }>;
	private createProjectUseCase: CreateProjectUseCase;
	readonly routePath = path;

	constructor(app: OpenAPIHono<{ Variables: AuthVariables }>, createProjectUseCase: CreateProjectUseCase) {
		this.app = app;
		this.createProjectUseCase = createProjectUseCase;
	}

	route() {
		this.app.use(this.routePath, authMiddleware);
		this.app.openapi(createProjectRouteDefinition, async (c) => {
			try {
				const { name, url = null } = c.req.valid('json');
				const user = c.var.user!;
				const project = await this.createProjectUseCase.execute(name, url ?? null, user.id);
				return c.json({ ...project, createdAt: project.createdAt.toISOString(), updatedAt: project.updatedAt?.toISOString() ?? null }, 201);
			} catch (error) {
				console.error(error);
				return c.json({ error: 'Internal server error' }, 500);
			}
		});

		return this.app;
	}
}
