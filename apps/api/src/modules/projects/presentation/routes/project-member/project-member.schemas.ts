import { z } from '@hono/zod-openapi';
import { MEMBER_ROLES } from '@app/types';

export const projectMemberSchema = z.object({
	projectId: z.uuid(),
	userId: z.string(),
	role: z.enum(MEMBER_ROLES),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime().nullable(),
});
