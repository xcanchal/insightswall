import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { SUGGESTION_CATEGORIES, SUGGESTION_STATUSES } from '@app/types';
import { type AuthVariables } from '../../../../lib/auth.js';
import { optionalAuthMiddleware } from '../../../../lib/middlewares/optional-auth.middleware.js';
import { GetSuggestionsUseCase } from '../../application/use-cases/get-suggestions.use-case.js';
import { ProjectNotFoundError } from '../../../projects/domain/project/project.errors.js';
import { suggestionWithVoteContextSchema } from '../suggestion.schemas.js';

const path = '/api/projects/:projectId/suggestions';

const getSuggestionsRouteDefinition = createRoute({
	method: 'get',
	path,
	request: {
		params: z.object({ projectId: z.uuid() }),
		query: z.object({
			sortBy: z.enum(['mostVoted', 'newest']).optional().default('mostVoted'),
			categories: z.preprocess((val) => (typeof val === 'string' ? [val] : val), z.array(z.enum(SUGGESTION_CATEGORIES)).optional()),
			statuses: z.preprocess((val) => (typeof val === 'string' ? [val] : val), z.array(z.enum(SUGGESTION_STATUSES)).optional()),
			search: z.string().optional(),
		}),
	},
	responses: {
		200: { content: { 'application/json': { schema: z.array(suggestionWithVoteContextSchema) } }, description: 'Suggestions list' },
		400: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Bad request' },
		404: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Project not found' },
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
				const { sortBy, categories, statuses, search } = c.req.valid('query');
				const userId = c.var.user?.id ?? null;
				const results = await this.getSuggestionsUseCase.execute(projectId, userId, sortBy, { categories, statuses, search });
				return c.json(
					results.map(({ suggestion: s, voteCount, userHasVoted }) => ({
						...s,
						voteCount,
						userHasVoted,
						rejectionReason: s.rejectionReason ?? null,
						createdAt: s.createdAt.toISOString(),
						updatedAt: s.updatedAt?.toISOString() ?? null,
					})),
					200
				);
			} catch (error) {
				if (error instanceof ProjectNotFoundError) return c.json({ error: error.message }, 404);
				console.error(error);
				return c.json({ error: 'Internal server error' }, 500);
			}
		});
		return this.app;
	}
}
