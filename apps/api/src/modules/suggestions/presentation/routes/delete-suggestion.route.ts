import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { authMiddleware } from '../../../../lib/middlewares/auth.middleware.js';
import { type AuthVariables } from '../../../../lib/auth.js';
import { DeleteSuggestionUseCase } from '../../application/use-cases/delete-suggestion.use-case.js';
import { NotOwnerOrAdminError } from '../../domain/suggestion.errors.js';

const path = '/api/projects/:projectId/suggestions/:suggestionId';

const deleteSuggestionRouteDefinition = createRoute({
	method: 'delete',
	path,
	request: {
		params: z.object({ projectId: z.uuid(), suggestionId: z.uuid() }),
	},
	responses: {
		204: { description: 'Suggestion deleted' },
		400: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Bad request' },
		401: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Unauthorized' },
		403: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Forbidden' },
		500: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Internal server error' },
	},
});

export class DeleteSuggestionRoute {
	private app: OpenAPIHono<{ Variables: AuthVariables }>;
	private deleteSuggestionUseCase: DeleteSuggestionUseCase;
	readonly routePath = path;

	constructor(app: OpenAPIHono<{ Variables: AuthVariables }>, deleteSuggestionUseCase: DeleteSuggestionUseCase) {
		this.app = app;
		this.deleteSuggestionUseCase = deleteSuggestionUseCase;
	}

	route() {
		this.app.use(this.routePath, authMiddleware);
		this.app.openapi(deleteSuggestionRouteDefinition, async (c) => {
			try {
				const { suggestionId } = c.req.valid('param');
				const user = c.var.user!;
				await this.deleteSuggestionUseCase.execute(suggestionId, user.id);
				return c.body(null, 204);
			} catch (error) {
				if (error instanceof NotOwnerOrAdminError) return c.json({ error: error.message }, 403);
				console.error(error);
				return c.json({ error: 'Internal server error' }, 500);
			}
		});
		return this.app;
	}
}
