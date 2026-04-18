import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { authMiddleware } from '../../../../lib/middlewares/auth.middleware.js';
import { type AuthVariables } from '../../../../lib/auth.js';
import { UnvoteSuggestionUseCase } from '../../application/use-cases/unvote-suggestion.use-case.js';

const path = '/api/suggestions/:suggestionId/votes';

const unvoteSuggestionRouteDefinition = createRoute({
	method: 'delete',
	path,
	request: { params: z.object({ suggestionId: z.uuid() }) },
	responses: {
		204: { description: 'Vote removed' },
		400: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Bad request' },
		401: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Unauthorized' },
		500: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Internal server error' },
	},
});

export class UnvoteSuggestionRoute {
	private app: OpenAPIHono<{ Variables: AuthVariables }>;
	private unvoteSuggestionUseCase: UnvoteSuggestionUseCase;
	readonly routePath = path;

	constructor(app: OpenAPIHono<{ Variables: AuthVariables }>, unvoteSuggestionUseCase: UnvoteSuggestionUseCase) {
		this.app = app;
		this.unvoteSuggestionUseCase = unvoteSuggestionUseCase;
	}

	route() {
		this.app.use(this.routePath, authMiddleware);
		this.app.openapi(unvoteSuggestionRouteDefinition, async (c) => {
			try {
				const { suggestionId } = c.req.valid('param');
				await this.unvoteSuggestionUseCase.execute(suggestionId, c.var.user!.id);
				return c.body(null, 204);
			} catch (error) {
				console.error(error);
				return c.json({ error: 'Internal server error' }, 500);
			}
		});
		return this.app;
	}
}
