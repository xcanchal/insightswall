import { z } from '@hono/zod-openapi';
import { SUGGESTION_CATEGORIES, SUGGESTION_STATUSES } from '@app/types';

export const suggestionSchema = z.object({
	id: z.uuid(),
	projectId: z.uuid(),
	userId: z.string(),
	description: z.string(),
	category: z.enum(SUGGESTION_CATEGORIES),
	status: z.enum(SUGGESTION_STATUSES),
	voteCount: z.number(),
	userHasVoted: z.boolean(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime().nullable(),
});
