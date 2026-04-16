import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { authMiddleware } from '../../../../lib/middlewares/auth.middleware.js';
import { createProjectAdminMiddleware } from '../../../../lib/middlewares/project-admin.middleware.js';
import { type AuthVariables } from '../../../../lib/auth.js';
import { DeleteSuggestionUseCase } from '../../application/use-cases/delete-suggestion.use-case.js';
import type { IProjectMemberRepository } from '../../../projects/domain/project-member/project-member.repository.js';

const path = '/api/projects/:projectId/suggestions/:suggestionId';

const deleteSuggestionRouteDefinition = createRoute({
	method: 'delete',
	path,
	request: {
		params: z.object({ projectId: z.uuid(), suggestionId: z.uuid() }),
	},
	responses: {
		204: { description: 'Suggestion deleted' },
		401: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Unauthorized' },
		403: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Forbidden' },
		500: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Internal server error' },
	},
});

export class DeleteSuggestionRoute {
	private app: OpenAPIHono<{ Variables: AuthVariables }>;
	private deleteSuggestionUseCase: DeleteSuggestionUseCase;
	private projectMemberRepository: IProjectMemberRepository;
	readonly routePath = path;

	constructor(
		app: OpenAPIHono<{ Variables: AuthVariables }>,
		deleteSuggestionUseCase: DeleteSuggestionUseCase,
		projectMemberRepository: IProjectMemberRepository
	) {
		this.app = app;
		this.deleteSuggestionUseCase = deleteSuggestionUseCase;
		this.projectMemberRepository = projectMemberRepository;
	}

	route() {
		this.app.use(this.routePath, authMiddleware);
		this.app.use(this.routePath, createProjectAdminMiddleware(this.projectMemberRepository));
		this.app.openapi(deleteSuggestionRouteDefinition, async (c) => {
			try {
				const { suggestionId } = c.req.valid('param');
				await this.deleteSuggestionUseCase.execute(suggestionId);
				return c.body(null, 204);
			} catch (error) {
				console.error(error);
				return c.json({ error: 'Internal server error' }, 500);
			}
		});
		return this.app;
	}
}
