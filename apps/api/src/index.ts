import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { auth } from './auth.js';
import { createServer } from './server.js';

// TODO: Split index and server files

/* const app = new Hono();

app.use(logger());

app.get('/', (c) => {
	return c.json({ message: 'InsightsWall API' });
});

app.get('/health', (c) => {
	return c.json({ status: 'ok' });
});

// Auth
app.on(['POST', 'GET'], '/api/auth/**', (c) => auth.handler(c.req.raw));

const port = Number(process.env.PORT) || 3000;

serve({ fetch: app.fetch, port }, () => {
	console.log(`Server running on http://localhost:${port}`);
});

export default app;
 */

(async () => {
	try {
		/* const REQUIRED_ENV_VARS = ['DATABASE_URL', 'BETTER_AUTH_SECRET', 'BETTER_AUTH_URL', 'FRONTEND_URL'] as const;

		for (const key of REQUIRED_ENV_VARS) {
			if (!process.env[key]) {
				console.error(`Missing required environment variable: ${key}`);
				process.exit(1);
			}
		} */

		const app = createServer();

		const port = Number(process.env.PORT) || 3000;

		serve({ fetch: app.fetch, port }, () => {
			console.log(`Server running on http://localhost:${port}`);
		});
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
})();
