import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { authMiddleware } from '../../../../lib/middlewares/auth.middleware.js';
import { type AuthVariables } from '../../../../lib/auth.js';
import { CreateSuggestionUseCase } from '../../application/use-cases/create-suggestion.use-case.js';
import { suggestionSchema } from '../suggestion.schemas.js';
import { SUGGESTION_CATEGORIES } from '@app/types';

const bodySchema = z.object({
	projectId: z.uuid(),
	description: z.string().min(1).max(500),
	category: z.enum(SUGGESTION_CATEGORIES),
});

const path = '/api/suggestions';

const createSuggestionRouteDefinition = createRoute({
	method: 'post',
	path,
	request: { body: { content: { 'application/json': { schema: bodySchema } }, required: true } },
	responses: {
		201: { content: { 'application/json': { schema: suggestionSchema } }, description: 'Suggestion created' },
		500: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Internal server error' },
	},
});

export class CreateSuggestionRoute {
	private app: OpenAPIHono<{ Variables: AuthVariables }>;
	private createSuggestionUseCase: CreateSuggestionUseCase;
	readonly routePath = path;

	constructor(app: OpenAPIHono<{ Variables: AuthVariables }>, createSuggestionUseCase: CreateSuggestionUseCase) {
		this.app = app;
		this.createSuggestionUseCase = createSuggestionUseCase;
	}

	route() {
		this.app.use(this.routePath, authMiddleware);
		this.app.openapi(createSuggestionRouteDefinition, async (c) => {
			try {
				const { projectId, description, category } = c.req.valid('json');
				const user = c.var.user!;
				const suggestion = await this.createSuggestionUseCase.execute(projectId, user.id, description, category);
				return c.json(
					{
						...suggestion,
						voteCount: 0,
						userHasVoted: false,
						createdAt: suggestion.createdAt.toISOString(),
						updatedAt: suggestion.updatedAt?.toISOString() ?? null,
					},
					201
				);
			} catch (error) {
				console.error(error);
				return c.json({ error: 'Internal server error' }, 500);
			}
		});

		return this.app;
	}
}
