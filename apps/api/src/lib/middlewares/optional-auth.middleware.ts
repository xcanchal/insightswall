import { createMiddleware } from 'hono/factory';
import { auth, type AuthVariables } from '../auth.js';

export const optionalAuthMiddleware = createMiddleware<{ Variables: AuthVariables }>(async (c, next) => {
	const session = await auth.api.getSession({ headers: c.req.raw.headers });
	c.set('user', session?.user ?? null);
	c.set('session', session?.session ?? null);
	await next();
});
