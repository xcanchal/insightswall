import { createFileRoute } from '@tanstack/react-router';

/**
 * Delegates every /api/** request (REST modules + better-auth) to the Hono
 * app. The dynamic import keeps db/auth/email out of the module graph during
 * prerendering and client bundling.
 */
const handler = async ({ request }: { request: Request }) => {
	const { getApiServer } = await import('@/server/app');
	return getApiServer().fetch(request);
};

export const Route = createFileRoute('/api/$')({
	server: {
		handlers: {
			GET: handler,
			POST: handler,
			PATCH: handler,
			PUT: handler,
			DELETE: handler,
			OPTIONS: handler,
		},
	},
});
