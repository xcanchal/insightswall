import { Hono } from 'hono';
import { authMiddleware } from '../../../../middlewares/auth.middleware.js';
import { GetUserUseCase } from '../../application/use-cases/get-user.use-case.js';

export class GetUserRoute {
	private app: Hono;
	private getUserUseCase: GetUserUseCase;
	readonly routePath: string = '/api/users/:id';

	constructor(app: Hono, getUserUseCase: GetUserUseCase) {
		this.app = app;
		this.getUserUseCase = getUserUseCase;
	}

	route() {
		this.app.get(this.routePath, authMiddleware, async (c) => {
			try {
				// TODO: How to validate params? Does Hono include anything or should we use Zod or something?
				const userId = c.req.param('id');
				if (!userId) return c.json({ error: 'User ID is required' }, 400);
				const user = await this.getUserUseCase.execute(userId);
				return c.json(user);
			} catch (error) {
				// TODO: How to handle errors thrown by the use case? It's not always an internal server error. TODO: Use a custom error handler.
				return c.json({ error: 'Internal server error' }, 500);
			}
		});

		return this.app;
	}
}
