import { createMiddleware } from 'hono/factory';
import { auth } from '../auth.js';

export type AuthVariables = {
	user: typeof auth.$Infer.Session.user;
	session: typeof auth.$Infer.Session.session;
};

export const authMiddleware = createMiddleware<{ Variables: AuthVariables }>(async (c, next) => {
	const session = await auth.api.getSession({ headers: c.req.raw.headers });

	if (!session) {
		return c.json({ error: 'Unauthorized', message: 'Authentication required', statusCode: 401 }, 401);
	}

	c.set('user', session.user);
	c.set('session', session.session);
	await next();
});
