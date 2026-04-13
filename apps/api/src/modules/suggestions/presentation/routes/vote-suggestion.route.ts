import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { authMiddleware } from '../../../../lib/middlewares/auth.middleware.js';
import { type AuthVariables } from '../../../../lib/auth.js';
import { VoteSuggestionUseCase } from '../../application/use-cases/vote-suggestion.use-case.js';

const path = '/api/suggestions/:suggestionId/votes';

const voteSuggestionRouteDefinition = createRoute({
	method: 'post',
	path,
	request: { params: z.object({ suggestionId: z.uuid() }) },
	responses: {
		204: { description: 'Vote cast' },
		401: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Unauthorized' },
		500: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Internal server error' },
	},
});

export class VoteSuggestionRoute {
	private app: OpenAPIHono<{ Variables: AuthVariables }>;
	private voteSuggestionUseCase: VoteSuggestionUseCase;
	readonly routePath = path;

	constructor(app: OpenAPIHono<{ Variables: AuthVariables }>, voteSuggestionUseCase: VoteSuggestionUseCase) {
		this.app = app;
		this.voteSuggestionUseCase = voteSuggestionUseCase;
	}

	route() {
		this.app.use(this.routePath, authMiddleware);
		this.app.openapi(voteSuggestionRouteDefinition, async (c) => {
			try {
				const { suggestionId } = c.req.valid('param');
				await this.voteSuggestionUseCase.execute(suggestionId, c.var.user!.id);
				return c.body(null, 204);
			} catch (error) {
				console.error(error);
				return c.json({ error: 'Internal server error' }, 500);
			}
		});
		return this.app;
	}
}
