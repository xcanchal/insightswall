import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { authMiddleware } from '../../../../../lib/middlewares/auth.middleware.js';
import { createProjectAdminMiddleware } from '../../../../../lib/middlewares/project-admin.middleware.js';
import { type AuthVariables } from '../../../../../lib/auth.js';
import { UpdateProjectUseCase } from '../../../application/use-cases/project/update-project.use-case.js';
import { projectSchema } from './project.schemas.js';
import type { IProjectMemberRepository } from '../../../domain/project-member/project-member.repository.js';

const path = '/api/projects/:projectId' as const;
const bodySchema = z.object({
	name: z.string().min(1).max(50),
	url: z.url().nullish(),
});

const updateProjectRouteDefinition = createRoute({
	method: 'patch',
	path,
	request: {
		params: z.object({ projectId: z.uuid() }),
		body: { content: { 'application/json': { schema: bodySchema } }, required: true },
	},
	responses: {
		200: { content: { 'application/json': { schema: projectSchema } }, description: 'Project updated' },
		400: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Bad request' },
		401: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Unauthorized' },
		403: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Forbidden' },
		404: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Project not found' },
		500: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Internal server error' },
	},
});

export class UpdateProjectRoute {
	private app: OpenAPIHono<{ Variables: AuthVariables }>;
	private updateProjectUseCase: UpdateProjectUseCase;
	private projectMemberRepository: IProjectMemberRepository;
	readonly routePath = path;

	constructor(
		app: OpenAPIHono<{ Variables: AuthVariables }>,
		updateProjectUseCase: UpdateProjectUseCase,
		projectMemberRepository: IProjectMemberRepository
	) {
		this.app = app;
		this.updateProjectUseCase = updateProjectUseCase;
		this.projectMemberRepository = projectMemberRepository;
	}

	route() {
		this.app.use(this.routePath, authMiddleware);
		this.app.use(this.routePath, createProjectAdminMiddleware(this.projectMemberRepository));
		this.app.openapi(updateProjectRouteDefinition, async (c) => {
			try {
				const { projectId } = c.req.valid('param');
				const { name, url = null } = c.req.valid('json');
				const project = await this.updateProjectUseCase.execute(projectId, name, url ?? null);
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
