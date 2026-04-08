import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { authMiddleware } from '../../../../lib/middlewares/auth.middleware.js';
import { type AuthVariables } from '../../../../lib/auth.js';
import { GetUserUseCase } from '../../application/use-cases/get-user.use-case.js';

const paramsSchema = z.object({
	id: z.uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
});

const userResponseSchema = z.object({
	id: z.uuid(),
	email: z.email(),
	name: z.string(),
	emailVerified: z.boolean(),
	image: z.string().nullable(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
});

const getUserRouteDefinition = createRoute({
	method: 'get',
	path: '/api/users/{id}',
	request: { params: paramsSchema },
	responses: {
		200: { content: { 'application/json': { schema: userResponseSchema } }, description: 'User found' },
		404: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'User not found' },
		500: { content: { 'application/json': { schema: z.object({ error: z.string() }) } }, description: 'Internal server error' },
	},
});

export class GetUserRoute {
	private app: OpenAPIHono<{ Variables: AuthVariables }>;
	private getUserUseCase: GetUserUseCase;
	readonly routePath: string = '/api/users/:id';

	constructor(app: OpenAPIHono<{ Variables: AuthVariables }>, getUserUseCase: GetUserUseCase) {
		this.app = app;
		this.getUserUseCase = getUserUseCase;
	}

	route() {
		this.app.use(this.routePath, authMiddleware);
		this.app.openapi(getUserRouteDefinition, async (c) => {
			try {
				const { id } = c.req.valid('param');
				const user = await this.getUserUseCase.execute(id);
				if (!user) return c.json({ error: 'User not found' }, 404);
				return c.json(
					{
						...user,
						createdAt: user.createdAt.toISOString(),
						updatedAt: user.updatedAt.toISOString(),
					},
					200
				);
			} catch (error) {
				return c.json({ error: 'Internal server error' }, 500);
			}
		});

		return this.app;
	}
}
