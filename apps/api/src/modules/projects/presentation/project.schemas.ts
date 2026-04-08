import { z } from '@hono/zod-openapi';

export const projectSchema = z.object({
	id: z.uuid(),
	name: z.string(),
	slug: z.string(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime().nullable(),
});
