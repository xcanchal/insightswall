import { z } from '@hono/zod-openapi';

export const projectSchema = z.object({
	id: z.uuid(),
	name: z.string(),
	url: z.url().nullable(),
	isRoadmapPublic: z.boolean(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime().nullable(),
});
