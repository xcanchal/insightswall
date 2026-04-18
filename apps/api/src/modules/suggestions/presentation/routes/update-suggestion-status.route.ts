import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { SUGGESTION_STATUSES } from '@app/types';
import { authMiddleware } from '../../../../lib/middlewares/auth.middleware.js';
import { createProjectAdminMiddleware } from '../../../../lib/middlewares/project-admin.middleware.js';
import { type AuthVariables } from '../../../../lib/auth.js';
import { UpdateSuggestionStatusUseCase } from '../../application/use-cases/update-suggestion-status.use-case.js';
import { suggestionSchema } from '../suggestion.schemas.js';
import type { IProjectMemberRepository } from '../../../projects/domain/project-member/project-member.repository.js';

const path = '/api/projects/:projectId/suggestions/:suggestionId/status';

const updateSuggestionStatusRouteDefinition = createRoute({
	method: 'patch',
	path,
	request: {
		params: z.object({ projectId: z.uuid(), suggestionId: z.uuid() }),
		body: {
			content: {
				'application/json': {
					schema: z.object({
						status: z.enum(SUGGESTION_STATUSES),
						rejectionReason: z.string().max(500).optional(),
					}),
				},
			},
			required: true,
		},
	},
	responses: {
		200: { content: { 'application/json': { schema: suggestionSchema } }, description: 'Suggestion status updated' },
		400: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Bad request' },
		401: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Unauthorized' },
		403: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Forbidden' },
		404: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Suggestion not found' },
		500: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Internal server error' },
	},
});

export class UpdateSuggestionStatusRoute {
	private app: OpenAPIHono<{ Variables: AuthVariables }>;
	private updateSuggestionStatusUseCase: UpdateSuggestionStatusUseCase;
	private projectMemberRepository: IProjectMemberRepository;
	readonly routePath = path;

	constructor(
		app: OpenAPIHono<{ Variables: AuthVariables }>,
		updateSuggestionStatusUseCase: UpdateSuggestionStatusUseCase,
		projectMemberRepository: IProjectMemberRepository
	) {
		this.app = app;
		this.updateSuggestionStatusUseCase = updateSuggestionStatusUseCase;
		this.projectMemberRepository = projectMemberRepository;
	}

	route() {
		this.app.use(this.routePath, authMiddleware);
		this.app.use(this.routePath, createProjectAdminMiddleware(this.projectMemberRepository));
		this.app.openapi(updateSuggestionStatusRouteDefinition, async (c) => {
			try {
				const { suggestionId } = c.req.valid('param');
				const { status, rejectionReason } = c.req.valid('json');
				const suggestion = await this.updateSuggestionStatusUseCase.execute(suggestionId, status, rejectionReason);
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
				console.error(error);
				return c.json({ error: 'Internal server error' }, 500);
			}
		});
		return this.app;
	}
}
