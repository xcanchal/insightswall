import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { authMiddleware } from '../../../../lib/middlewares/auth.middleware.js';
import { type AuthVariables } from '../../../../lib/auth.js';
import { GetSuggestionsUseCase } from '../../application/use-cases/get-suggestions.use-case.js';
import { suggestionSchema } from '../suggestion.schemas.js';

const path = '/api/projects/:projectId/suggestions';

const getSuggestionsRouteDefinition = createRoute({
	method: 'get',
	path,
	request: {
		params: z.object({ projectId: z.uuid() }),
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
		this.app.use(this.routePath, authMiddleware);
		this.app.openapi(getSuggestionsRouteDefinition, async (c) => {
			try {
				const { projectId } = c.req.valid('param');
				const suggestions = await this.getSuggestionsUseCase.execute(projectId);
				return c.json(
					suggestions.map((s) => ({
						...s,
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
