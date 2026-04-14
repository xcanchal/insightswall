import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { SUGGESTION_CATEGORIES, SUGGESTION_STATUSES } from '@app/types';
import { type AuthVariables } from '../../../../lib/auth.js';
import { optionalAuthMiddleware } from '../../../../lib/middlewares/optional-auth.middleware.js';
import { GetSuggestionsUseCase } from '../../application/use-cases/get-suggestions.use-case.js';
import { suggestionSchema } from '../suggestion.schemas.js';

const path = '/api/projects/:projectId/suggestions';

const getSuggestionsRouteDefinition = createRoute({
	method: 'get',
	path,
	request: {
		params: z.object({ projectId: z.uuid() }),
		query: z.object({
				sortBy: z.enum(['mostVoted', 'newest']).optional().default('mostVoted'),
				categories: z.array(z.enum(SUGGESTION_CATEGORIES)).optional(),
				statuses: z.array(z.enum(SUGGESTION_STATUSES)).optional(),
			}),
	},
	responses: {
		200: { content: { 'application/json': { schema: z.array(suggestionSchema) } }, description: 'Suggestions list' },
		500: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Internal server error' },
	},
});

export class GetSuggestionsRoute {
	private app: OpenAPIHono<{ Variables: AuthVariables }>;
	private getSuggestionsUseCase: GetSuggestionsUseCase;
	readonly routePath = path;

	constructor(app: OpenAPIHono<{ Variables: AuthVariables }>, getSuggestionsUseCase: GetSuggestionsUseCase) {
		this.app = app;
		this.getSuggestionsUseCase = getSuggestionsUseCase;
	}

	route() {
		this.app.use(this.routePath, optionalAuthMiddleware);
		this.app.openapi(getSuggestionsRouteDefinition, async (c) => {
			try {
				const { projectId } = c.req.valid('param');
				const { sortBy, categories, statuses } = c.req.valid('query');
				const userId = c.var.user?.id ?? null;
				const results = await this.getSuggestionsUseCase.execute(projectId, userId, sortBy, { categories, statuses });
				return c.json(
					results.map(({ suggestion: s, voteCount, userHasVoted }) => ({
						...s,
						voteCount,
						userHasVoted,
						createdAt: s.createdAt.toISOString(),
						updatedAt: s.updatedAt?.toISOString() ?? null,
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
