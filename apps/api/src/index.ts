import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';

const app = new Hono();

app.use(logger());

app.get('/', (c) => {
	return c.json({ message: 'InsightsWall API' });
});

app.get('/health', (c) => {
	return c.json({ status: 'ok' });
});

const port = Number(process.env.PORT) || 3000;

serve({ fetch: app.fetch, port }, () => {
	console.log(`Server running on http://localhost:${port}`);
});

export default app;
