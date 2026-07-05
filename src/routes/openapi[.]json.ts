import { createFileRoute } from '@tanstack/react-router';

const handler = async ({ request }: { request: Request }) => {
	const { getApiServer } = await import('@/server/app');
	return getApiServer().fetch(request);
};

export const Route = createFileRoute('/openapi.json')({
	server: {
		handlers: {
			GET: handler,
		},
	},
});
