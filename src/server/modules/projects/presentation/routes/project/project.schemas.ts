import { z } from '@hono/zod-openapi';

export const projectSchema = z.object({
	id: z.uuid(),
	name: z.string(),
	url: z.url().nullable(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime().nullable(),
});
