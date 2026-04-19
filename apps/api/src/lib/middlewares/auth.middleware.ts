import { createMiddleware } from 'hono/factory';
import { auth, type AuthVariables } from '../auth.js';

export const authMiddleware = createMiddleware<{ Variables: AuthVariables }>(async (c, next) => {
	const session = await auth.api.getSession({ headers: c.req.raw.headers });

	if (!session) {
		return c.json({ error: 'Unauthorized', message: 'Authentication required', statusCode: 401 }, 401);
	}

	c.set('user', session.user);
	c.set('session', session.session);
	await next();
});
