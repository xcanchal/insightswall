import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { authMiddleware } from '../../../../lib/middlewares/auth.middleware.js';
import { type AuthVariables } from '../../../../lib/auth.js';
import { EditSuggestionUseCase } from '../../application/use-cases/edit-suggestion.use-case.js';
import { NotSuggestionOwnerError } from '../../domain/suggestion.errors.js';
import { suggestionSchema } from '../suggestion.schemas.js';
import { SUGGESTION_CATEGORIES } from '@app/types';

const bodySchema = z.object({
	description: z.string().min(1).max(500),
	category: z.enum(SUGGESTION_CATEGORIES),
});

const path = '/api/projects/:projectId/suggestions/:suggestionId';

const editSuggestionRouteDefinition = createRoute({
	method: 'patch',
	path,
	request: {
		params: z.object({ projectId: z.uuid(), suggestionId: z.uuid() }),
		body: { content: { 'application/json': { schema: bodySchema } }, required: true },
	},
	responses: {
		200: { content: { 'application/json': { schema: suggestionSchema } }, description: 'Suggestion updated' },
		400: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Bad request' },
		401: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Unauthorized' },
		403: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Forbidden' },
		404: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Not found' },
		500: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Internal server error' },
	},
});

export class EditSuggestionRoute {
	private app: OpenAPIHono<{ Variables: AuthVariables }>;
	private editSuggestionUseCase: EditSuggestionUseCase;
	readonly routePath = path;

	constructor(app: OpenAPIHono<{ Variables: AuthVariables }>, editSuggestionUseCase: EditSuggestionUseCase) {
		this.app = app;
		this.editSuggestionUseCase = editSuggestionUseCase;
	}

	route() {
		this.app.use(this.routePath, authMiddleware);
		this.app.openapi(editSuggestionRouteDefinition, async (c) => {
			try {
				const { suggestionId } = c.req.valid('param');
				const { description, category } = c.req.valid('json');
				const user = c.var.user!;
				const suggestion = await this.editSuggestionUseCase.execute(suggestionId, user.id, description, category);
				if (!suggestion) return c.json({ error: 'Suggestion not found' }, 404);
				return c.json(
					{
						...suggestion,
						rejectionReason: suggestion.rejectionReason ?? null,
						createdAt: suggestion.createdAt.toISOString(),
						updatedAt: suggestion.updatedAt?.toISOString() ?? null,
					},
					200
				);
			} catch (error) {
				if (error instanceof NotSuggestionOwnerError) return c.json({ error: error.message }, 403);
				console.error(error);
				return c.json({ error: 'Internal server error' }, 500);
			}
		});
		return this.app;
	}
}
